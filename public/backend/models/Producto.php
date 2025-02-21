<?php

class Producto
{
    private $conn;
    private $table = "productos";

    public function __construct($db)
    {
        $this->conn = $db;
    }
    public function getAllProducts() {
        $query = "SELECT * FROM " . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function searchProducts($searchTerm)
    {
        $query = "SELECT * FROM " . $this->table . " WHERE nombre LIKE :searchTerm OR marca LIKE :searchTerm";
        $stmt = $this->conn->prepare($query);

        $searchTerm = "%" . $searchTerm . "%"; // Agregar comodines para búsqueda parcial
        $stmt->bindParam(":searchTerm", $searchTerm, PDO::PARAM_STR);

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function getPaginated($page = 1, $items_per_page = 25)
    {
        try {
            $offset = ($page - 1) * $items_per_page;

            // Get total count
            $total_query = "SELECT COUNT(*) as total FROM productos";
            $stmt = $this->conn->prepare($total_query);
            $stmt->execute();
            $total_row = $stmt->fetch(PDO::FETCH_ASSOC);
            $total_products = $total_row['total'];

            // Calculate total pages
            $total_pages = ceil($total_products / $items_per_page);

            // Get products for current page with their categories
            $query = "SELECT 
                        p.id, 
                        p.nombre, 
                        p.descripcion, 
                        p.marca, 
                        p.imagen,
                        GROUP_CONCAT(c.nombre) as categorias,
                        (SELECT detalles FROM detalles_tecnicos dt WHERE dt.id_producto = p.id) as detalles_tecnicos
                    FROM productos p
                    LEFT JOIN producto_categoria pc ON p.id = pc.id_producto
                    LEFT JOIN categorias c ON pc.id_categoria = c.id
                    GROUP BY p.id
                    ORDER BY p.id ASC
                    LIMIT :limit OFFSET :offset";

            $stmt = $this->conn->prepare($query);
            $stmt->bindValue(':limit', $items_per_page, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();

            $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Procesar los detalles técnicos de JSON a array
            foreach ($productos as &$producto) {
                if ($producto['detalles_tecnicos']) {
                    $producto['detalles_tecnicos'] = json_decode($producto['detalles_tecnicos'], true);
                }
                // Convertir categorías de string a array
                $producto['categorias'] = $producto['categorias'] ? explode(',', $producto['categorias']) : [];
            }

            return [
                "productos" => $productos,
                "totalPages" => $total_pages,
                "totalProducts" => $total_products
            ];
        } catch (PDOException $e) {
            throw $e;
        }
    }
    public function searchProductsByCategory($category)
    {
        if (empty($category) || ($category) === 'Todos') {

            $query = "SELECT * FROM productos";
            $stmt = $this->conn->prepare($query);
        } else {

            $query = "SELECT p.* FROM productos p
                      JOIN producto_categoria pc ON p.id = pc.id_producto
                      JOIN categorias c ON pc.id_categoria = c.id
                      WHERE c.nombre = :category";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':category', $category, PDO::PARAM_STR);
        }

        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    public function getPaginatedByCategory($category, $page = 1, $items_per_page = 25)
    {
        try {
            $offset = ($page - 1) * $items_per_page;

            // Si la categoría es 'Todos' o está vacía
            if (empty($category) || $category === 'Todos') {
                // Obtener total de productos
                $total_query = "SELECT COUNT(*) as total FROM productos";
                $stmt = $this->conn->prepare($total_query);
                $stmt->execute();
                $total_row = $stmt->fetch(PDO::FETCH_ASSOC);
                $total_products = $total_row['total'];

                // Obtener productos paginados
                $query = "SELECT * FROM productos LIMIT :limit OFFSET :offset";
                $stmt = $this->conn->prepare($query);
            } else {
                // Obtener total de productos por categoría
                $total_query = "SELECT COUNT(DISTINCT p.id) as total 
                               FROM productos p
                               JOIN producto_categoria pc ON p.id = pc.id_producto
                               JOIN categorias c ON pc.id_categoria = c.id
                               WHERE c.nombre = :category";
                $stmt = $this->conn->prepare($total_query);
                $stmt->bindParam(':category', $category, PDO::PARAM_STR);
                $stmt->execute();
                $total_row = $stmt->fetch(PDO::FETCH_ASSOC);
                $total_products = $total_row['total'];

                // Obtener productos paginados por categoría
                $query = "SELECT DISTINCT p.* 
                         FROM productos p
                         JOIN producto_categoria pc ON p.id = pc.id_producto
                         JOIN categorias c ON pc.id_categoria = c.id
                         WHERE c.nombre = :category
                         LIMIT :limit OFFSET :offset";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':category', $category, PDO::PARAM_STR);
            }

            // Calcular total de páginas
            $total_pages = ceil($total_products / $items_per_page);

            // Ejecutar consulta paginada
            if (!empty($category) && $category !== 'Todos') {
                $stmt->bindParam(':category', $category, PDO::PARAM_STR);
            }
            $stmt->bindValue(':limit', $items_per_page, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();

            $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return [
                "productos" => count($productos) > 0 ? $productos : ["No se encontraron resultados"],
                "totalPages" => $total_pages,
                "totalProducts" => $total_products
            ];
        } catch (PDOException $e) {
            throw $e;
        }
    }

    public function searchByFilteredCategory($category, $searchTerm, $page = 1, $items_per_page = 25)
{
    try {
        $offset = ($page - 1) * $items_per_page;
        $searchTerm = "%$searchTerm%"; // Buscar coincidencias exactas

        // Si la categoría es 'Todos' o está vacía
        if (empty($category) || $category === 'Todos') {
            // Obtener total de productos que coinciden con la búsqueda
            $total_query = "SELECT COUNT(*) as total 
                       FROM productos 
                       WHERE (nombre = :searchTerm 
                       OR marca = :searchTerm)";
            $stmt = $this->conn->prepare($total_query);
            $stmt->bindParam(':searchTerm', $searchTerm, PDO::PARAM_STR);
            $stmt->execute();
            $total_row = $stmt->fetch(PDO::FETCH_ASSOC);
            $total_products = $total_row['total'];

            // Obtener productos paginados que coinciden con la búsqueda
            $query = "SELECT * FROM productos 
                 WHERE (nombre = :searchTerm 
                 OR marca = :searchTerm) 
                 LIMIT :limit OFFSET :offset";
            $stmt_products = $this->conn->prepare($query);
            $stmt_products->bindParam(':searchTerm', $searchTerm, PDO::PARAM_STR);
        } else {
            // Obtener total de productos por categoría que coinciden con la búsqueda
            $total_query = "SELECT COUNT(DISTINCT p.id) as total 
                       FROM productos p
                       JOIN producto_categoria pc ON p.id = pc.id_producto
                       JOIN categorias c ON pc.id_categoria = c.id
                       WHERE TRIM(LOWER(c.nombre)) = TRIM(LOWER(:category))
                       AND (p.nombre LIKE :searchTerm OR p.marca LIKE :searchTerm)";
            $stmt = $this->conn->prepare($total_query);
            $stmt->bindParam(':category', $category, PDO::PARAM_STR);
            $stmt->bindParam(':searchTerm', $searchTerm, PDO::PARAM_STR);
            $stmt->execute();
            $total_row = $stmt->fetch(PDO::FETCH_ASSOC);
            $total_products = $total_row['total'];

            // Obtener productos paginados por categoría que coinciden con la búsqueda
            $query = "SELECT DISTINCT p.* 
                 FROM productos p
                 JOIN producto_categoria pc ON p.id = pc.id_producto
                 JOIN categorias c ON pc.id_categoria = c.id
                 WHERE TRIM(LOWER(c.nombre)) = TRIM(LOWER(:category))
                 AND (p.nombre LIKE :searchTerm OR p.marca LIKE :searchTerm)
                 LIMIT :limit OFFSET :offset";
            $stmt_products = $this->conn->prepare($query);
            $stmt_products->bindParam(':category', $category, PDO::PARAM_STR);
            $stmt_products->bindParam(':searchTerm', $searchTerm, PDO::PARAM_STR);
        }

        // Calcular total de páginas
        $total_pages = ceil($total_products / $items_per_page);

        // Ejecutar consulta paginada
        $stmt_products->bindValue(':limit', $items_per_page, PDO::PARAM_INT);
        $stmt_products->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt_products->execute();
        $productos = $stmt_products->fetchAll(PDO::FETCH_ASSOC);

        return [
            "productos" => count($productos) > 0 ? $productos : ["No se encontraron resultados"],
            "totalPages" => $total_pages,
            "totalProducts" => $total_products
        ];
    } catch (PDOException $e) {
        throw $e;
    }
}

    public function getProductDetails($productId)
    {
        $query = "SELECT dt.detalles 
                  FROM detalles_tecnicos dt 
                  WHERE dt.id_producto = :productId";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':productId', $productId, PDO::PARAM_INT);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ? json_decode($result['detalles'], true) : null;
    }


    // Método para agregar un producto
    public function agregar($nombre, $descripcion, $marca, $imagen, $categorias, $detalles)
    {
        try {
            // Iniciar transacción
            $this->conn->beginTransaction();

            // Insertar en la tabla productos
            $query = "INSERT INTO productos (nombre, descripcion, marca, imagen) VALUES (?, ?, ?, ?)";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$nombre, $descripcion, $marca, $imagen]);

            // Obtener el ID del producto recién insertado
            $idProducto = $this->conn->lastInsertId();

            // Insertar en la tabla producto_categoria
            $query = "INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (?, ?)";
            $stmt = $this->conn->prepare($query);
            foreach ($categorias as $idCategoria) {
                if (!$stmt->execute([$idProducto, $idCategoria])) {
                    throw new Exception("Error al insertar en producto_categoria: " . implode(", ", $stmt->errorInfo()));
                }
            }

            // Insertar en la tabla detalles_tecnicos
            $query = "INSERT INTO detalles_tecnicos (id_producto, detalles) VALUES (?, ?)";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$idProducto, json_encode($detalles)]);

            // Confirmar la transacción
            $this->conn->commit();
            return true;
        } catch (PDOException $e) {
            // Revertir la transacción en caso de error
            $this->conn->rollBack();
            throw $e;
        }
    }

    // producto.php

    public function editar($id, $nombre, $descripcion, $marca, $imagen, $categorias, $detalles)
    {
        try {
            $this->conn->beginTransaction();

            // Actualizar producto
            $query = "UPDATE productos SET nombre = ?, descripcion = ?, marca = ?, imagen = ? WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$nombre, $descripcion, $marca, $imagen, $id]);

            // Actualizar categorías
            $query = "DELETE FROM producto_categoria WHERE id_producto = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$id]);

            $query = "INSERT INTO producto_categoria (id_producto, id_categoria) VALUES (?, ?)";
            $stmt = $this->conn->prepare($query);
            foreach ($categorias as $idCategoria) {
                $stmt->execute([$id, $idCategoria]);
            }

            // Actualizar detalles técnicos
            $query = "UPDATE detalles_tecnicos SET detalles = ? WHERE id_producto = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([json_encode($detalles), $id]);

            $this->conn->commit();
            return true;
        } catch (PDOException $e) {
            $this->conn->rollBack();
            throw $e;
        }
    }

    public function eliminar($id)
    {
        try {
            $query = "DELETE FROM productos WHERE id = ?";
            $stmt = $this->conn->prepare($query);
            return $stmt->execute([$id]);
        } catch (PDOException $e) {
            throw $e;
        }
    }
}
