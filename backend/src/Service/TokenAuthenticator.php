<?php

namespace App\Service;

use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Lexik\Bundle\JWTAuthenticationBundle\Exception\JWTDecodeFailureException;
use Lexik\Bundle\JWTAuthenticationBundle\TokenExtractor\AuthorizationHeaderTokenExtractor;

class TokenAuthenticator
{
    private $jwtEncoder;
    private $userRepository;

    public function __construct(JWTEncoderInterface $jwtEncoder, UserRepository $userRepository)
    {
        $this->jwtEncoder = $jwtEncoder;
        $this->userRepository = $userRepository;
    }

    public function authenticateToken($request)
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
            throw new HttpException(Response::HTTP_UNAUTHORIZED, 'Invalid JWT token.');
        }
    }
}
