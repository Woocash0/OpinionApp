<?php

namespace App\Controller;

use App\Entity\User;

use App\Entity\Warranty;
use PhpParser\Node\Expr\New_;
use App\Form\WarrantyFormType;
use App\Repository\UserRepository;
use App\Repository\WarrantyRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManager;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
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

    public function __construct(WarrantyRepository $warrantyRepository, UserRepository $userRepository, EntityManagerInterface $em, JWTTokenManagerInterface $jwtManager, TokenStorageInterface $tokenStorage, JWTEncoderInterface $jwtEncoder)
    {
        $this->warrantyRepository = $warrantyRepository;
        $this->userRepository = $userRepository;
        $this->em = $em;
        $this->jwtManager = $jwtManager;
        $this->tokenStorage = $tokenStorage;
        $this->jwtEncoder = $jwtEncoder;
    }

    private function authenticateToken($request)
    {
        $tokenExtractor = new AuthorizationHeaderTokenExtractor('Bearer', 'Authorization');
        $tokenString = $tokenExtractor->extract($request);

        try {
            $decodedToken = $this->jwtEncoder->decode($tokenString);
            $currentTime = time();
            if ($decodedToken['exp'] < $currentTime) {
                throw new AccessDeniedException('Token has expired.');
            }
            $email = $decodedToken['email'];
            $user = $this->userRepository->findOneBy(['email' => $email]);
            if (!$user) {
                throw new AccessDeniedException('User not found.');
            }
            return $user;
        } catch (JWTDecodeFailureException $e) {
            throw new BadCredentialsException('Invalid JWT token.');
        }
    }


    #[Route('/warranties', methods:['GET'])]
    public function index(Request $request): JsonResponse
    {
        try {
            // Wywołaj metodę authenticateToken z klasy TokenAuthenticator
            $user = $this->authenticateToken($request);
    
            // Jeśli użytkownik został pomyślnie uwierzytelniony, możesz kontynuować przetwarzanie
            return new JsonResponse([
                'message' => "success", 
                'email' => $user->getEmail(), 
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                ],
            ]);
        } catch (BadCredentialsException $e) {
            return new JsonResponse(['message' => 'Nieprawidłowy token JWT.'], Response::HTTP_UNAUTHORIZED);
        } catch (AccessDeniedException $e) {
            return new JsonResponse(['message' => 'Sesja wygasła lub użytkownik nie istnieje. Zaloguj się ponownie.'], Response::HTTP_UNAUTHORIZED);
        }
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


    #[Route('/delete_warranty/{id}', methods:['GET','DELETE'], name: 'delete_warranty')]
    public function deleteWarranty($id): Response {

        $warranty = $this->warrantyRepository->find($id);

        $this->em->remove($warranty);
        $this->em->flush();

        return $this->redirectToRoute('warranties');
    }

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
                $user = $this->authenticateToken($request);
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