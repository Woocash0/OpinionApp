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
use Symfony\Component\HttpFoundation\File\Exception\FileException;


class ProductController extends AbstractController
{
    #[Route('/products', name: 'get_products', methods: ['GET'])]
    public function getProducts(EntityManagerInterface $em): JsonResponse
    {
        $products = $em->getRepository(Product::class)->findAll();
    
        $productData = [];

        foreach ($products as $product) {
            $productData[] = [
                'id' => $product->getId(),
                'productName' => $product->getProductName(),
                'description' => $product->getDescription(),
                'image' => $product->getImage(),
                'categoryId' =>$product->getCategory()->getId(),
                'categoryName' =>$product->getCategory()->getCategoryName(),
                'opinions' => $product->getOpinions(),
                'barcode' => $product->getBarcode(),
                'producer' => $product->getProducer()
            ];
        }

        return new JsonResponse($productData);
    }
    
    
    
    #[Route('/add_product', name: 'add_product', methods: ['POST'])]
    public function addProduct(Request $request, SerializerInterface $serializer, EntityManagerInterface $em, ValidatorInterface $validator): JsonResponse
    {
        $data = $request->request->all();
        $file = $request->files->get('image');

        // Jeśli nie wybrano obrazka, ustaw domyślną ścieżkę
        if($file){
            $newFileName = uniqid() . '.' . $file->guessExtension();

            try{
                /*$file->move(
                    $this->getParameter('kernel.project_dir') . '/public/uploads',
                    $newFileName
                );
                */
                $file->move(
                    $this->getParameter('kernel.project_dir') . '../../frontend/src/Images/productImages',
                    $newFileName
                );
            } catch(FileException $e){
                return new JsonResponse(['errors' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
            }

            $data['image'] = $newFileName;
        }else{
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