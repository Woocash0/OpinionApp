<?php

namespace App\Controller;

use App\Entity\User;

use App\Entity\Product;
use App\Entity\Category;
use App\Entity\Warranty;
use PhpParser\Node\Expr\New_;
use App\Form\WarrantyFormType;
use App\Repository\UserRepository;
use App\Service\TokenAuthenticator;
use App\Repository\WarrantyRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManager;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\DependencyInjection\Loader\Configurator\validator;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\HttpFoundation\File\Exception\AccessDeniedException;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\JWTDecodeFailureException;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Lexik\Bundle\JWTAuthenticationBundle\TokenExtractor\AuthorizationHeaderTokenExtractor;



class WarrantiesController extends AbstractController
{
    private $warrantyRepository;
    private $userRepository;
    private $em;
    private $jwtManager;
    private $tokenStorage;
    private $jwtEncoder;
    private $tokenAuthenticator;

    public function __construct(WarrantyRepository $warrantyRepository, UserRepository $userRepository, EntityManagerInterface $em, JWTTokenManagerInterface $jwtManager, TokenStorageInterface $tokenStorage, JWTEncoderInterface $jwtEncoder, TokenAuthenticator $tokenAuthenticator)
    {
        $this->warrantyRepository = $warrantyRepository;
        $this->userRepository = $userRepository;
        $this->em = $em;
        $this->jwtManager = $jwtManager;
        $this->tokenStorage = $tokenStorage;
        $this->jwtEncoder = $jwtEncoder;
        $this->tokenAuthenticator = $tokenAuthenticator;
    }


    #[Route('/warranties', methods:['GET'])]
    public function index(Request $request, EntityManagerInterface $em): JsonResponse
    {
        try {
            $userEmail = $request->query->get('owner');

            if (!$userEmail) {
                return new JsonResponse(['error' => 'User Email is required'], Response::HTTP_BAD_REQUEST);
            }
            $user = $em->getRepository(User::class)->findOneBy(['email' => $userEmail]);
            
            if (!$user) {
                return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
            }
            // Wywołaj metodę authenticateToken z klasy TokenAuthenticator
            //$user = $this->tokenAuthenticator->authenticateToken($request);
    
            // Jeśli użytkownik został pomyślnie uwierzytelniony, możesz kontynuować przetwarzanie
            $warranties = $this->warrantyRepository->findWarrantiesWithTags($user->getId());

            return new JsonResponse([
                'warranties' => array_map(function ($warranty) {
                    return [
                        'id' => $warranty->getId(),
                        'category' => $warranty->getProduct()->getCategory()->getCategoryName(),
                        'productName' =>  $warranty->getProduct()->getProductName(),
                        'purchaseDate' => $warranty->getPurchaseDate()->format('Y-m-d'), // Format daty
                        'warrantyPeriod' => $warranty->getWarrantyPeriod(),
                        'receipt' => $warranty->getReceipt(),
                        'tags' => array_map(function ($tag) {
                            return $tag->getName(); // Lista nazw tagów
                        }, $warranty->getTags()->toArray()),
                    ];
                }, $warranties),
            ], 200); // Odpowiedź z kodem 200 (OK)

        } catch (BadCredentialsException $e) {
            return new JsonResponse(['message' => 'Nieprawidłowy token JWT.'], Response::HTTP_UNAUTHORIZED);
        } catch (AccessDeniedException $e) {
            return new JsonResponse(['message' => 'Sesja wygasła lub użytkownik nie istnieje. Zaloguj się ponownie.'], Response::HTTP_UNAUTHORIZED);
        }
    }

    #[Route('/warranty/{id}', name: 'get_warranty', methods:['GET'])]
    public function getWarranty(Request $request, EntityManagerInterface $em, int $id): JsonResponse
    {
        $user = $this->tokenAuthenticator->authenticateToken($request);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        $warranty = $em->getRepository(Warranty::class)->find($id);
        if (!$warranty) {
            return new JsonResponse(['error' => 'Warranty not found'], Response::HTTP_NOT_FOUND);
        }

        if($user !== $warranty->getIdUser()){
            return new JsonResponse(['error' => 'You do not have permission to access or modify this warranty.'], Response::HTTP_FORBIDDEN);
        }

        return new JsonResponse([
            'id' => $warranty->getId(),
            'categoryId' => $warranty->getProduct()->getCategory()->getId(),
            'productName' => $warranty->getProduct()->getProductName(),
            'purchase_date' => $warranty->getPurchaseDate()->format('Y-m-d'),
            'warranty_period' => $warranty->getWarrantyPeriod(),
            'user_id' => $warranty->getIdUser(),
            'receipt' => $warranty->getReceipt()
        ]);
    }




/*
        // if (!$user) {
        //     return new JsonResponse(['error' => 'Unauthorized'], 401); // Zwróć błąd, jeśli użytkownik nie jest zalogowany
        // }

        // Pobierz wszystkie gwarancje użytkownika
        $warranties = $this->warrantyRepository->findWarrantiesWithTags($user->getId());

        $currentDate = new \DateTime();
        $validWarranties = array_filter($warranties, function($warranty) use ($currentDate) {
        $endDate = clone $warranty->getPurchaseDate();
        $endDate->modify('+ ' . $warranty->getWarrantyPeriod() . ' years');
        return $endDate >= $currentDate;
        });

        return new JsonResponse([
            'warranties' => array_map(function ($warranty) {
                return [
                    'id' => $warranty->getId(),
                    'category' => $warranty->getCategory(),
                    'productName' => $warranty->getProductName(),
                    'purchaseDate' => $warranty->getPurchaseDate()->format('Y-m-d'), // Format daty
                    'warrantyPeriod' => $warranty->getWarrantyPeriod(),
                    'tags' => array_map(function ($tag) {
                        return $tag->getName(); // Lista nazw tagów
                    }, $warranty->getTags()->toArray()),
                ];
            }, $validWarranties),
        ], 200); // Odpowiedź z kodem 200 (OK)
    }

    */
    #[Route('/add_warranty', name: 'add_warranty', methods: ['POST'])]
    public function addProduct(Request $request, SerializerInterface $serializer, EntityManagerInterface $em, ValidatorInterface $validator): JsonResponse
    {
           try {
           $user = $this->tokenAuthenticator->authenticateToken($request);
           $data = $request->request->all();
           $file = $request->files->get('receipt');

           if($file){
               $newFileName = uniqid() . '.' . $file->guessExtension();

               try{
                   /*$file->move(
                       $this->getParameter('kernel.project_dir') . '/public/uploads',
                       $newFileName
                   );
                   */
                   $file->move(
                       $this->getParameter('kernel.project_dir') . '../../frontend/src/Images/receiptImages',
                       $newFileName
                   );
               } catch(FileException $e){
                   return new JsonResponse(['errors' => $e->getMessage()], Response::HTTP_BAD_REQUEST);
               }

               $data['receipt'] = $newFileName;
           }else{
               $data['receipt'] = 'no-image.svg';
           }

          // Process category_id based on subsubcategory_id and subcategory_id
          if (!empty($data['subsubcategoryId'])) {
           $data['categoryId'] = $data['subsubcategoryId'];
       } elseif (!empty($data['subcategory_id'])) {
           $data['categoryId'] = $data['subcategoryId'];
       }

       // Remove subsubcategory_id and subcategory_id from data
       unset($data['subsubcategoryId']);
       unset($data['subcategoryId']);

       if (!isset($data['productName'])) {
            return new JsonResponse(['error' => 'Product name is required'], 400);
       }
       
       $product_name = $em->getRepository(Product::class)->findOneBy(['ProductName' => $data['productName']]);
       
       if (!$product_name) {
           throw new NotFoundHttpException('Product not found');
       }

       // Create new Product entity and set its properties
       $warranty = new Warranty();
       //$warranty->setCategory($em->getRepository(Category::class)->find($data['categoryId']));
       $warranty->setProduct($product_name);
       //$warranty->setCategory($data['categoryId']);
       //$warranty->setProductName($data['productName']);

       $date = new \Datetime($data['purchase_date']);
       $warranty->setPurchaseDate($date);
       $warranty->setWarrantyPeriod($data['warranty_period']);
       $warranty->setIdUser($user);
       $warranty->setReceipt($data['receipt']);
       $warranty->setActive(True);

       // Validate the Product entity
       $errors = $validator->validate($warranty);

           if (count($errors) > 0) {
               $errorMessages = [];
               foreach ($errors as $error) {
                   $errorMessages[] = $error->getMessage();
               }
               return new JsonResponse(['error' => $errorMessages], Response::HTTP_BAD_REQUEST);
           }

           // Dodanie produktu
           $em->persist($warranty);
           $em->flush();

           return new JsonResponse(['message' => 'Product added successfully'], Response::HTTP_CREATED);

    } catch (BadCredentialsException $e) {
        return new JsonResponse(['message' => 'Nieprawidłowy token JWT.'], Response::HTTP_UNAUTHORIZED);
    } catch (AccessDeniedException $e) {
        return new JsonResponse(['message' => 'Sesja wygasła lub użytkownik nie istnieje. Zaloguj się ponownie.'], Response::HTTP_UNAUTHORIZED);
    }
    }
    /*
    

    #[Route('/add_warranty', name: 'add_warranty')]
    public function addWarranty(Request $request): Response
    {
        $user = $this->getUser();
        if (!$this->getUser()) {
            return $this->redirectToRoute('app_login');
        }
        
        
        $warranty = new Warranty();
        $form = $this->createForm(WarrantyFormType::class, $warranty);
        $form->handleRequest($request);
        if($form->isSubmitted() && $form->isValid()){
            $newWarranty = $form->getData();
            $newWarranty->setIdUser($user);

            $receipt = $form->get('receipt')->getData();

            if($receipt){
                $newFileName = uniqid() . '.' . $receipt->guessExtension();

                try{
                    $receipt->move(
                        $this->getParameter('kernel.project_dir') . '/public/uploads',
                        $newFileName
                    );
                } catch(FileException $e){
                    return new Response($e->getMessage());
                }

                $newWarranty->setReceipt($newFileName);
            }else{
                $newWarranty->setReceipt('no-image.svg');
            }

            $selectedTags = $form->get('tags')->getData();
            foreach ($selectedTags as $selectedTag) {
                $newWarranty->addTag($selectedTag);
            }
            
            $this->em->persist($newWarranty);
            $this->em->flush();

            return $this->redirectToRoute('warranties');
        }
        
        return $this->render('/views/dashboard/add_warranty.html.twig', [
            'form' => $form->createView()
        ]);
    }

    #[Route('/edit_warranty/{id}', name: 'edit_warranty')]
    public function editWarranty($id, Request $request, Security $security): Response {
        $user = $security->getUser();

        $warranty = $this->warrantyRepository->find($id);

        if (!$warranty) {
            throw $this->createNotFoundException('Gwarancja o podanym identyfikatorze nie istnieje.');
        }

        if ($warranty->getIdUser()->getId() !== $user->getId()) {
            throw $this->createAccessDeniedException('Nie masz uprawnień do edycji tej gwarancji.');
        }

        $form = $this->createForm(WarrantyFormType::class, $warranty);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $receipt = $form->get('receipt')->getData();

            if ($receipt) {
                if ($warranty->getReceipt() !== null) {
                    $this->getParameter('kernel.project_dir') . $warranty->getReceipt();
                    $newFileName = uniqid() . '.' . $receipt->guessExtension();
                        try{
                            $receipt->move(
                                $this->getParameter('kernel.project_dir') . '/public/uploads',
                                $newFileName
                            );
                        } catch(FileException $e){
                            return new Response($e->getMessage());
                        }
                        $warranty->setReceipt($newFileName);
                        $this->em->flush();
                        return $this->redirectToRoute('warranties');
                } else {
                    dd('jest nullem');
                }
            } else {
                $warranty->setCategory($form->get('category')->getData());
                $warranty->setProductName($form->get('product_name')->getData());
                $warranty->setPurchaseDate($form->get('purchase_date')->getData());
                $warranty->setWarrantyPeriod($form->get('warranty_period')->getData());

                $tags = $form->get('tags')->getData();

                foreach ($tags as $tag) {
                    $warranty->addTag($tag);
                }

                $this->em->flush();

                return $this->redirectToRoute('warranties');
            }
        }

        return $this->render('/views/dashboard/edit_warranty.html.twig', [
            'warranty' => $warranty,
            'form' => $form->createView(),
        ]);
    }
    */
    #[Route('/edit_warranty/{id}', name: 'edit_warranty', methods:["POST"])]
    public function updateWarranty(Request $request, EntityManagerInterface $em, int $id, ValidatorInterface $validator): JsonResponse
    {
        // Odczytanie danych z request
        $data = $request->request->all();
        error_log("Parsed Data: " . print_r($data, true));

        $receipt = $request->files->get('receipt');
        error_log("Receipt: " . print_r($receipt, true));
        $user = $this->tokenAuthenticator->authenticateToken($request);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        // Find the warranty
        $warranty = $em->getRepository(Warranty::class)->find($id);

        if (!$warranty) {
            return new JsonResponse(['error' => 'Warranty not found'], Response::HTTP_NOT_FOUND);
        }

        // Check if the user is the owner of the warranty
        if($user !== $warranty->getIdUser()){
            return new JsonResponse(['error' => 'You do not have permission to access or modify this warranty.'], Response::HTTP_FORBIDDEN);
        }

        if (isset($data['productName'])){
            $product_name = $em->getRepository(Product::class)->findOneBy(['ProductName' => $data['productName']]);
            $warranty->setProduct($product_name);
        }
        if (isset($data['purchase_date'])) $warranty->setPurchaseDate(new \DateTime($data['purchase_date']));
        if (isset($data['warranty_period'])) {
            $warranty->setWarrantyPeriod($data['warranty_period']);
        }
        
        // Handle file upload

        if (isset($receipt)){
            // Remove old file if exists
            if ($warranty->getReceipt()) {
                $oldFile = $this->getParameter('kernel.project_dir') . '../../frontend/src/Images/receiptImages/' . $warranty->getReceipt();
                if (file_exists($oldFile)) {
                    unlink($oldFile);
                }
            }
            // Save new file
            $newFileName = uniqid() . '.' . $receipt->guessExtension();
            try {
                $receipt->move(
                    $this->getParameter('kernel.project_dir') . '../../frontend/src/Images/receiptImages',
                    $newFileName
                );
            } catch (FileException $e) {
                return new JsonResponse(['error' => 'Failed to upload file: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
            $warranty->setReceipt($newFileName);
        }

        $errors = $validator->validate($warranty);

        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[] = $error->getMessage();
            }
            return new JsonResponse(['error' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        // Save changes
        $em->persist($warranty);
        $em->flush();

        return new JsonResponse(['success' => 'Warranty updated successfully'], Response::HTTP_OK);
    }

    /*
    #[Route('/delete_warranty/{id}', methods:['GET','DELETE'], name: 'delete_warranty')]
    public function deleteWarranty($id): Response {

        $warranty = $this->warrantyRepository->find($id);

        $this->em->remove($warranty);
        $this->em->flush();

        return $this->redirectToRoute('warranties');
    }
    */
    
    #[Route('/delete_warranty/{id}', name: 'delete_warranty', methods: ['DELETE'])]
    public function deleteWarranty(Request $request, int $id, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->tokenAuthenticator->authenticateToken($request);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        $warranty = $em->getRepository(Warranty::class)->find($id);

        if (!$warranty) {
            return new JsonResponse(['error' => 'Warranty not found'], 404);
        }

        if ($warranty->getReceipt()) {
            $oldFile = $this->getParameter('kernel.project_dir') . '../../frontend/src/Images/receiptImages/' . $warranty->getReceipt();
            if (file_exists($oldFile)) {
                unlink($oldFile);
            }
        }

        $em->remove($warranty);
        $em->flush();

        return new JsonResponse(['message' => 'Warranty deleted successfully'], 200);
    }
    /*
    #[Route('/search', methods: ['POST'])]
    public function search(Request $request): Response
    {
        $content = json_decode($request->getContent(), true);

        if (!isset($content['search'])) {
            return $this->json(['error' => 'Invalid request'], 400);
        }

        $user = $this->getUser();

        if (!$user) {
            return $this->redirectToRoute('app_login');
        }

        $searchString = '%'.strtolower($content['search']).'%';

        $query = $this->warrantyRepository->createQueryBuilder('w')
            ->andWhere('w.idUser = :id')
            ->andWhere('LOWER(w.category) LIKE :search OR LOWER(w.productName) LIKE :search')
            ->setParameter('id', $user->getId())
            ->setParameter('search', $searchString)
            ->getQuery();

        $searched = $query->getResult();
        
        return $this->json(
            $searched,
            headers: ['Content-Type' => 'application/json;charset=UTF-8']
        );
    }

    #[Route('/archive', methods:['GET'], name: 'archive')]
    public function archive(Security $security): Response
    {
        $user = $security->getUser();

        if (!$user) {
            return $this->redirectToRoute('app_login');
        }

        $warranties = $this->warrantyRepository->findBy(['idUser' => $user->getId()]);

        $currentDate = new \DateTime();
        $expiredWarranties = array_filter($warranties, function($warranty) use ($currentDate) {
            $endDate = clone $warranty->getPurchaseDate();
            $endDate->modify('+ ' . $warranty->getWarrantyPeriod() . ' years');
            return $endDate < $currentDate;
        });

        return $this->render('/views/dashboard/archive.html.twig', [
           'archives' => $expiredWarranties
            ]);
}
*/
    #[Route('/account', name: 'account')]
    public function showAccount(Request $request): JsonResponse{
            try {
                // Wywołaj metodę authenticateToken z klasy TokenAuthenticator
                $user = $this->tokenAuthenticator->authenticateToken($request);
                $userDetails = $user->getIdUserDetails();
        
                // Jeśli użytkownik został pomyślnie uwierzytelniony, możesz kontynuować przetwarzanie
                return new JsonResponse([
                    'message' => "success", 
                    'user' => [
                        'id' => $user->getId(),
                        'email' => $user->getEmail(),
                        'name' => $userDetails->getName(),
                        'surname' => $userDetails->getSurname(),
                    ],
                ]);
            } catch (BadCredentialsException $e) {
                return new JsonResponse(['message' => 'Nieprawidłowy token JWT.'], Response::HTTP_UNAUTHORIZED);
            } catch (AccessDeniedException $e) {
                return new JsonResponse(['message' => 'Sesja wygasła lub użytkownik nie istnieje. Zaloguj się ponownie.'], Response::HTTP_UNAUTHORIZED);
            }
    }

}