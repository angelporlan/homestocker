<?php

namespace App\Controller;

use App\Entity\Product;
use App\Entity\ProductDetail;
use App\Entity\House;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ProductController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    // Listar todos los productos de una casa
    #[Route('/houses/{houseId}/products', name: 'product_list', methods: ['GET'])]
    public function list(int $houseId): JsonResponse
    {
        $house = $this->entityManager->getRepository(House::class)->find($houseId);

        if (!$house) {
            return new JsonResponse(['error' => 'House not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $products = $house->getProducts()->map(function ($product) {
            return [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'category' => $product->getCategory(),
                'total_quantity' => $product->getTotalQuantity(),
                'photo' => $product->getPhoto(),
                'expiration_dates' => $product->getExpirationDates()->map(fn($detail) => [
                    'quantity' => $detail->getQuantity(),
                    'expiration_date' => $detail->getExpirationDate()->format('d-m-Y')
                ])->toArray()
            ];
        })->toArray();

        return new JsonResponse($products);
    }

    // Obtener un producto específico
    #[Route('/products/{productId}', name: 'product_get', methods: ['GET'])]
    public function get(int $productId): JsonResponse
    {
        $product = $this->entityManager->getRepository(Product::class)->find($productId);

        if (!$product) {
            return new JsonResponse(['error' => 'Product not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        return new JsonResponse([
            'id' => $product->getId(),
            'name' => $product->getName(),
            'category' => $product->getCategory(),
            'total_quantity' => $product->getTotalQuantity(),
            'photo' => $product->getPhoto(),
            'expiration_details' => $product->getExpirationDates()->map(fn($detail) => [
                'quantity' => $detail->getQuantity(),
                'expiration_date' => $detail->getExpirationDate()->format('d-m-Y')
            ])->toArray()
        ]);
    }

    #[Route('/houses/{houseId}/products', name: 'product_create', methods: ['POST'])]
    public function create(Request $request, int $houseId): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['name'], $data['category'], $data['quantities'])) {
            return new JsonResponse(['error' => 'Missing required fields'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $house = $this->entityManager->getRepository(House::class)->find($houseId);

        if (!$house) {
            return new JsonResponse(['error' => 'House not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        // creo el producto
        $product = new Product();
        $product->setName($data['name']);
        $product->setCategory($data['category']);
        $product->setHouse($house);


        $totalQuantity = 0;

        // proceso las cantidades y fechas de expiración
        foreach ($data['quantities'] as $quantityData) {
            if (!isset($quantityData['quantity'], $quantityData['expiration_date'])) {
                return new JsonResponse(['error' => 'Missing quantity or expiration_date'], JsonResponse::HTTP_BAD_REQUEST);
            }

            $totalQuantity += $quantityData['quantity'];

            // creo un nuevo detalle de producto (ProductDetail)
            $productDetail = new ProductDetail();
            $productDetail->setQuantity($quantityData['quantity']);

            // cambio la fecha de expiración en formato d-m-Y
            $expirationDate = \DateTime::createFromFormat('d-m-Y', $quantityData['expiration_date']);
            if (!$expirationDate) {
                return new JsonResponse(['error' => 'Invalid expiration_date format, should be d-m-Y'], JsonResponse::HTTP_BAD_REQUEST);
            }
            $productDetail->setExpirationDate($expirationDate);

            // añado el detalle al producto
            $product->addExpirationDate($productDetail);

            $this->entityManager->persist($productDetail);
        }

        $product->setTotalQuantity($totalQuantity);

        // compruebo la imagen
        if (isset($data['photo'])) {
            $photoData = $data['photo'];

            // verifico que la cadena esté en base64
            if (preg_match('/^data:image\/(\w+);base64,/', $photoData, $type)) {
                // borro el prefijo "data:image/*;base64,"
                $photoData = substr($photoData, strpos($photoData, ',') + 1);
                $photoData = base64_decode($photoData);

                if ($photoData === false) {
                    return new JsonResponse(['error' => 'Invalid base64 encoding'], JsonResponse::HTTP_BAD_REQUEST);
                }

                // determino la extensión de la imagen (jpg, png, etc.)
                $extension = strtolower($type[1]); // obtengo el tipo de imagen (png, jpg, gif, etc.)
                if (!in_array($extension, ['jpg', 'jpeg', 'png'])) {
                    return new JsonResponse(['error' => 'Invalid image type'], JsonResponse::HTTP_BAD_REQUEST);
                }

                // genero el nombre del archivo
                $fileName = uniqid() . '.' . $extension;

                // guardo la imagen en la carpeta `public/uploads/products/`
                $filePath = $this->getParameter('kernel.project_dir') . '/public/uploads/products/' . $fileName;
                file_put_contents($filePath, $photoData);

                // guardo la ruta de la imagen en la base de datos
                $product->setPhoto('/uploads/products/' . $fileName);
            } else {
                return new JsonResponse(['error' => 'Invalid image format'], JsonResponse::HTTP_BAD_REQUEST);
            }
        }



        // Guardar el producto en la base de datos
        $this->entityManager->persist($product);
        $this->entityManager->flush();

        return new JsonResponse([
            'id' => $product->getId(),
            'name' => $product->getName(),
            'category' => $product->getCategory(),
            'total_quantity' => $product->getTotalQuantity(),
            'photo' => $product->getPhoto(),
            'expiration_details' => array_map(function ($detail) {
                return [
                    'quantity' => $detail->getQuantity(),
                    'expiration_date' => $detail->getExpirationDate()->format('d-m-Y')
                ];
            }, $product->getExpirationDates()->toArray())
        ], JsonResponse::HTTP_CREATED);
    }




    // Agregar un detalle de expiración a un producto existente
    #[Route('/products/{productId}/details', name: 'product_add_detail', methods: ['POST'])]
    public function addDetail(Request $request, int $productId): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validar los campos necesarios
        if (!isset($data['quantity'], $data['expiration_date'])) {
            return new JsonResponse(['error' => 'Missing required fields'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $product = $this->entityManager->getRepository(Product::class)->find($productId);

        if (!$product) {
            return new JsonResponse(['error' => 'Product not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Convertir la fecha de expiración entrante de d-m-Y a un objeto DateTime
        $expirationDate = \DateTime::createFromFormat('d-m-Y', $data['expiration_date']);
        if (!$expirationDate) {
            return new JsonResponse(['error' => 'Invalid expiration_date format, should be d-m-Y'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Verificar si ya existe un detalle con esa fecha de expiración
        $existingDetail = null;
        foreach ($product->getExpirationDates() as $detail) {
            if ($detail->getExpirationDate()->format('Y-m-d') === $expirationDate->format('Y-m-d')) {
                $existingDetail = $detail;
                break;
            }
        }

        if ($existingDetail) {
            // Si ya existe un detalle con esa fecha, actualizar la cantidad
            $existingDetail->setQuantity($existingDetail->getQuantity() + $data['quantity']);
        } else {
            // Si no existe, crear un nuevo detalle de producto
            $detail = new ProductDetail();
            $detail->setQuantity($data['quantity']);
            $detail->setExpirationDate($expirationDate);
            $detail->setProduct($product);

            // Agregar el nuevo detalle al producto
            $product->addExpirationDate($detail);
            $this->entityManager->persist($detail);
        }

        // Actualizar la cantidad total del producto
        $product->setTotalQuantity($product->getTotalQuantity() + $data['quantity']);

        // Guardar los cambios en la base de datos
        $this->entityManager->flush();

        return new JsonResponse([
            'id' => $product->getId(),
            'name' => $product->getName(),
            'category' => $product->getCategory(),
            'total_quantity' => $product->getTotalQuantity(),
            'photo' => $product->getPhoto(),
            'expiration_details' => $product->getExpirationDates()->map(function ($detail) {
                return [
                    'quantity' => $detail->getQuantity(),
                    'expiration_date' => $detail->getExpirationDate()->format('d-m-Y')
                ];
            })->toArray()
        ], JsonResponse::HTTP_OK);
    }


    // Eliminar cantidad de un detalle de expiración de un producto existente
    #[Route('/products/{productId}/details/remove', name: 'product_remove_detail', methods: ['POST'])]
    public function removeDetail(Request $request, int $productId): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Validar los campos necesarios
        if (!isset($data['quantity'], $data['expiration_date'])) {
            return new JsonResponse(['error' => 'Missing required fields'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $product = $this->entityManager->getRepository(Product::class)->find($productId);

        if (!$product) {
            return new JsonResponse(['error' => 'Product not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Convertir la fecha de expiración entrante de d-m-Y a un objeto DateTime
        $expirationDate = \DateTime::createFromFormat('d-m-Y', $data['expiration_date']);
        if (!$expirationDate) {
            return new JsonResponse(['error' => 'Invalid expiration_date format, should be d-m-Y'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Verificar si ya existe un detalle con esa fecha de expiración
        $existingDetail = null;
        foreach ($product->getExpirationDates() as $detail) {
            if ($detail->getExpirationDate()->format('Y-m-d') === $expirationDate->format('Y-m-d')) {
                $existingDetail = $detail;
                break;
            }
        }

        if (!$existingDetail) {
            return new JsonResponse(['error' => 'Expiration detail not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Si la cantidad a eliminar es mayor que la cantidad actual, no se puede eliminar
        if ($data['quantity'] > $existingDetail->getQuantity()) {
            return new JsonResponse(['error' => 'Quantity to remove exceeds available quantity'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Restar la cantidad
        $existingDetail->setQuantity($existingDetail->getQuantity() - $data['quantity']);

        // Actualizar la cantidad total del producto
        $product->setTotalQuantity($product->getTotalQuantity() - $data['quantity']);

        // Si la cantidad en el detalle es 0 o menor, eliminar el detalle
        if ($existingDetail->getQuantity() <= 0) {
            $product->removeExpirationDate($existingDetail);
            $this->entityManager->remove($existingDetail);
        }

        // Guardar los cambios en la base de datos
        $this->entityManager->flush();

        return new JsonResponse([
            'id' => $product->getId(),
            'name' => $product->getName(),
            'category' => $product->getCategory(),
            'total_quantity' => $product->getTotalQuantity(),
            'photo' => $product->getPhoto(),
            'expiration_details' => $product->getExpirationDates()->map(function ($detail) {
                return [
                    'quantity' => $detail->getQuantity(),
                    'expiration_date' => $detail->getExpirationDate()->format('d-m-Y')
                ];
            })->toArray()
        ], JsonResponse::HTTP_OK);
    }



    // Actualizar un producto existente
    #[Route('/products/{productId}', name: 'product_update', methods: ['PUT'])]
    public function update(Request $request, int $productId): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $product = $this->entityManager->getRepository(Product::class)->find($productId);

        if (!$product) {
            return new JsonResponse(['error' => 'Product not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Actualizar los campos del producto
        if (isset($data['name'])) {
            $product->setName($data['name']);
        }
        if (isset($data['category'])) {
            $product->setCategory($data['category']);
        }
        if (isset($data['photo'])) {
            $product->setPhoto($data['photo']);
        }

        // Guardar los cambios en la base de datos
        $this->entityManager->flush();

        return new JsonResponse([
            'id' => $product->getId(),
            'name' => $product->getName(),
            'category' => $product->getCategory(),
            'photo' => $product->getPhoto()
        ]);
    }

    // Eliminar un producto existente
    #[Route('/products/{productId}', name: 'product_delete', methods: ['DELETE'])]
    public function delete(int $productId): JsonResponse
    {
        $product = $this->entityManager->getRepository(Product::class)->find($productId);

        if (!$product) {
            return new JsonResponse(['error' => 'Product not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        //borrar imagen
        if ($product->getPhoto()) {
            $filePath = $this->getParameter('kernel.project_dir') . '/public' . $product->getPhoto();
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        // Eliminar el producto de la base de datos
        $this->entityManager->remove($product);
        $this->entityManager->flush();

        return new JsonResponse(['message' => 'Product deleted'], JsonResponse::HTTP_OK);
    }
}
