<?php

namespace App\Controller;

use DateTime;
use App\Entity\User;
use App\Entity\Opinion;
use App\Entity\Product;
use App\Entity\Category;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use App\Service\WarrantyNotificationService;
use App\Service\TokenAuthenticator;



class ProductController extends AbstractController
{
    private $tokenAuthenticator;
    private $productRepository;
    private $em;
    private $warrantyNotificationService;

    public function __construct(TokenAuthenticator $tokenAuthenticator, ProductRepository $productRepository, EntityManagerInterface $em, WarrantyNotificationService $warrantyNotificationService)
    {
        $this->tokenAuthenticator = $tokenAuthenticator;
        $this->productRepository = $productRepository;
        $this->em = $em;
        $this->warrantyNotificationService = $warrantyNotificationService;
    }

    #[Route('/products', name: 'get_products', methods: ['GET'])]
    public function getProducts(EntityManagerInterface $em): JsonResponse
    {
        $products = $em->getRepository(Product::class)->findBy(['inspected' => true]);
    
        $productData = [];

        foreach ($products as $product) {
            $opinions = [];
            foreach ($product->getOpinions() as $opinion) {
                $opinions[] = [
                    'id' => $opinion->getId(),
                    'opinionText' => $opinion->getOpinionText(),
                    'rating' => $opinion->getRating(),
                    'durability_rating' => $opinion->getDurabilityRating(),
                    'price_rating' => $opinion->getPriceRating(),
                    'design_rating' => $opinion->getDesignRating(),
                    'capabilities_rating' => $opinion->getCapabilitiesRating(),
                    'thumbsUp' => $opinion->getThumbsUp(),
                    'thumbsDown' => $opinion->getThumbsDown(),
                    'createdBy' => $opinion->getCreatedBy()->getEmail(),
                    'createdAt' => $opinion->getCreatedAt() ? $opinion->getCreatedAt()->format('Y-m-d') : null
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

        $user = $this->tokenAuthenticator->authenticateToken($request);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        
        $file = $request->files->get('image');

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

       if (!empty($data['subsubcategory_id'])) {
        $data['category_id'] = $data['subsubcategory_id'];
    } elseif (!empty($data['subcategory_id'])) {
        $data['category_id'] = $data['subcategory_id'];
    }

    unset($data['subsubcategory_id']);
    unset($data['subcategory_id']);

    $product = new Product();
    $product->setCategory($em->getRepository(Category::class)->find($data['category_id']));
    $product->setProductName($data['product_name']);
    $product->setProducer($data['producer']);
    $product->setBarcode($data['barcode']);
    $product->setDescription($data['description']);
    $product->setImage($data['image']);
    $product->setInspected(false);
    $product->setCreator($user);

    $errors = $validator->validate($product);

        $errors = $validator->validate($product);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return new JsonResponse(['error' => "Form Validation Error"], Response::HTTP_BAD_REQUEST);
        }

        $em->persist($product);
        $em->flush();

        return new JsonResponse(['message' => 'Product added successfully'], Response::HTTP_CREATED);
    }

    #[Route('/unapproved', name: 'unapproved_products', methods: ['GET'])]
    public function getUnapprovedProducts(Request $request)
    {
        $user = $this->tokenAuthenticator->authenticateToken($request);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        if (!in_array("ROLE_MODERATOR", $user->getRoles())) {
            return new JsonResponse(['error' => 'User unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $products = $this->productRepository->findUnapprovedProducts();
        $data = [];

        foreach ($products as $product) {
            $data[] = [
                'id' => $product->getId(),
                'productName' => $product->getProductName(),
                'image' => $product->getImage(),
                'category' => $product->getCategory()->getCategoryName(),
                'barcode' => $product->getBarcode(),
                'producer' => $product->getProducer(),
                'description' => $product->getDescription(),
                'creator' => $product->getCreator()->getUserIdentifier(),
            ];
        }
        return new JsonResponse($data);
    }

    #[Route('/product/approve/{id}', name: 'approve_product', methods: ['POST'])]
    public function approveProduct(Request $request, int $id): Response
    {
        $user = $this->tokenAuthenticator->authenticateToken($request);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        if (!in_array("ROLE_MODERATOR", $user->getRoles())) {
            return new JsonResponse(['error' => 'User unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $product = $this->em->getRepository(Product::class)->find($id);
        if (!$product) {
            return new JsonResponse(['message' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }

        $product->setInspected(true);
        $owner = $product->getCreator();
        $this->warrantyNotificationService->sendEmailAboutProductApproved($owner, $product);
        $this->em->flush();

        return new JsonResponse(['message' => 'Product approved']);
    }

    #[Route('/product/disapprove/{id}', name: 'disapprove_product', methods: ['DELETE'])]
    public function disapproveProduct(Request $request, int $id): Response
    {
        $user = $this->tokenAuthenticator->authenticateToken($request);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        if (!in_array("ROLE_MODERATOR", $user->getRoles())) {
            return new JsonResponse(['error' => 'User unauthorized'], Response::HTTP_UNAUTHORIZED);
        }
        
        $product = $this->em->getRepository(Product::class)->find($id);
        if (!$product) {
            return new JsonResponse(['message' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }
        $owner = $product->getCreator();
        $this->warrantyNotificationService->sendEmailAboutProductDisapproved($owner, $product);

        //$this->em->remove($product);
        //$this->em->flush();

        return new JsonResponse(['message' => 'Product disapproved']);
    }
}