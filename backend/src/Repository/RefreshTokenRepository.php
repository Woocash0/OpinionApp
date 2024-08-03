<?php

namespace App\Repository;

use App\Entity\RefreshToken;
use Doctrine\ORM\NoResultException;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;

/**
 * @extends ServiceEntityRepository<RefreshToken>
 *
 * @method RefreshToken|null find($id, $lockMode = null, $lockVersion = null)
 * @method RefreshToken|null findOneBy(array $criteria, array $orderBy = null)
 * @method RefreshToken[]    findAll()
 * @method RefreshToken[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RefreshTokenRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RefreshToken::class);
    }

    public function findUserByRefreshToken(string $refreshToken)
    {
        try {
            $tokenEntity = $this->createQueryBuilder('r')
                ->where('r.token = :token')
                ->setParameter('token', $refreshToken)
                ->getQuery()
                ->getSingleResult();

            return $tokenEntity->getUser();
        } catch (NoResultException $e) {
            return null; // Token not found
        }
    }

    public function save(RefreshToken $refreshToken): void
    {
        $entityManager = $this->getEntityManager();
        $entityManager->persist($refreshToken);
        $entityManager->flush();
    }

//    /**
//     * @return RefreshToken[] Returns an array of RefreshToken objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('r.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?RefreshToken
//    {
//        return $this->createQueryBuilder('r')
//            ->andWhere('r.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
