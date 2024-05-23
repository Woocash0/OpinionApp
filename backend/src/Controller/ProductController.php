<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Opinion;
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
            $opinions = [];
            foreach ($product->getOpinions() as $opinion) {
                $opinions[] = [
                    'id' => $opinion->getId(),
                    'opinionText' => $opinion->getOpinionText(),
                    'rating' => $opinion->getRating(),
                    'thumbsUp' => $opinion->getThumbsUp(),
                    'thumbsDown' => $opinion->getThumbsDown(),
                    'createdBy' => $opinion->getCreatedBy()->getEmail()
                ];
            }

            $productData[] = [
                'id' => $product->getId(),
                'productName' => $product->getProductName(),
                'description' => $product->getDescription(),
                'image' => $product->getImage(),
                'categoryId' => $product->getCategory()->getId(),
                'categoryName' => $product->getCategory()->getCategoryName(),
                'opinions' => $opinions,
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




    #[Route('/add_opinion', name: 'add_opinion', methods: ['POST'])]
    public function addOpinion(Request $request, SerializerInterface $serializer, EntityManagerInterface $em, ValidatorInterface $validator): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $productId = $data['productId'] ?? null;

        if (!$productId) {
            return new JsonResponse(['error' => 'Product ID is required'], Response::HTTP_BAD_REQUEST);
        }

        $product = $em->getRepository(Product::class)->find($productId);
        if (!$product) {
            return new JsonResponse(['error' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }

        $opinion = new Opinion();
        $opinion->setOpinionText($data['opinionText']);
        $opinion->setRating(0);
        $opinion->setThumbsUp($data['thumbsUp'] ?? null);
        $opinion->setThumbsDown($data['thumbsDown'] ?? null);
      
         // Assuming you have a User entity and a way to fetch the user. This is just an example.
         $userEmail = $data['createdBy'] ?? null;
         if (!$userEmail) {
             return new JsonResponse(['error' => 'User Email is required'], Response::HTTP_BAD_REQUEST);
         }
 
         $user = $em->getRepository(User::class)->find($userEmail);
         if (!$user) {
             return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
         }
 
         $opinion->setCreatedBy($user);
         $product->addOpinion($opinion);
 
         $em->persist($opinion);
         $em->flush();
 
         return new JsonResponse(['status' => 'Opinion added'], Response::HTTP_CREATED);
    }
}