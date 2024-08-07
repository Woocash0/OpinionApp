<?php

namespace App\Repository;

use App\Entity\UserOpinionReaction;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<UserOpinionReaction>
 *
 * @method UserOpinionReaction|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserOpinionReaction|null findOneBy(array $criteria, array $orderBy = null)
 * @method UserOpinionReaction[]    findAll()
 * @method UserOpinionReaction[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserOpinionReactionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserOpinionReaction::class);
    }

//    /**
//     * @return UserOpinionReaction[] Returns an array of UserOpinionReaction objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('u.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?UserOpinionReaction
//    {
//        return $this->createQueryBuilder('u')
//            ->andWhere('u.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
    /**
     * @return UserOpinionReaction[] Returns an array of UserOpinionReaction objects
     */
    public function findReactionsByProductIdAndUser($productId, $userId): array
    {
        return $this->createQueryBuilder('u')
            ->innerJoin('u.opinion', 'o')
            ->innerJoin('o.product', 'p')
            ->andWhere('p.id = :productId')
            ->andWhere('u.voter = :userId')
            ->setParameter('productId', $productId)
            ->setParameter('userId', $userId)
            ->getQuery()
            ->getResult();
    }
}
