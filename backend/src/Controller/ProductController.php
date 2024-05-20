<?php

namespace App\Controller;

use App\Entity\Product;
use App\Entity\Category;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;


class ProductController extends AbstractController
{
    #[Route('/add_product', name: 'add_product', methods: ['POST'])]
    public function addProduct(Request $request, SerializerInterface $serializer, EntityManagerInterface $em, ValidatorInterface $validator): JsonResponse
    {
        $data = $request->request->all();
        $file = $request->files->get('image');

        // Jeśli nie wybrano obrazka, ustaw domyślną ścieżkę
        if (!$file) {
            $data['image'] = 'no-image.svg';
        }

       // Process category_id based on subsubcategory_id and subcategory_id
       if (!empty($data['subsubcategory_id'])) {
        $data['category_id'] = $data['subsubcategory_id'];
    } elseif (!empty($data['subcategory_id'])) {
        $data['category_id'] = $data['subcategory_id'];
    }

    // Remove subsubcategory_id and subcategory_id from data
    unset($data['subsubcategory_id']);
    unset($data['subcategory_id']);

    // Create new Product entity and set its properties
    $product = new Product();
    $product->setCategory($em->getRepository(Category::class)->find($data['category_id']));
    $product->setProductName($data['product_name']);
    $product->setProducer($data['producer']);
    $product->setBarcode($data['barcode']);
    $product->setDescription($data['description']);
    $product->setImage($data['image']);

    // Validate the Product entity
    $errors = $validator->validate($product);

        // Walidacja danych
        $errors = $validator->validate($product);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return new JsonResponse(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        // Dodanie produktu
        $em->persist($product);
        $em->flush();

        return new JsonResponse(['message' => 'Product added successfully'], Response::HTTP_CREATED);
    }
}