<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[UniqueEntity(fields: ['email'], message: 'There is already an account with this email')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?UserDetails $idUserDetails = null;

    #[ORM\OneToMany(mappedBy: 'createdBy', targetEntity: Opinion::class, orphanRemoval: true)]
    private Collection $opinions;

    #[ORM\OneToMany(mappedBy: 'voter', targetEntity: UserOpinionReaction::class, orphanRemoval: true)]
    private Collection $userOpinionReactions;

    #[ORM\OneToMany(mappedBy: 'associatedUser', targetEntity: RefreshToken::class)]
    private Collection $refreshTokens;

    #[ORM\OneToMany(mappedBy: 'creator', targetEntity: Product::class)]
    private Collection $products;

    #[ORM\OneToMany(mappedBy: 'appuser', targetEntity: Login::class, orphanRemoval: true)]
    private Collection $logins;

    public function __construct()
    {
        $this->opinions = new ArrayCollection();
        $this->userOpinionReactions = new ArrayCollection();
        $this->refreshTokens = new ArrayCollection();
        $this->products = new ArrayCollection();
        $this->logins = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;

        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getIdUserDetails(): ?UserDetails
    {
        return $this->idUserDetails;
    }

    public function setIdUserDetails(?UserDetails $idUserDetails): static
    {
        $this->idUserDetails = $idUserDetails;

        return $this;
    }

    /**
     * @return Collection<int, Opinion>
     */
    public function getOpinions(): Collection
    {
        return $this->opinions;
    }

    public function addOpinion(Opinion $opinion): static
    {
        if (!$this->opinions->contains($opinion)) {
            $this->opinions->add($opinion);
            $opinion->setCreatedBy($this);
        }

        return $this;
    }

    public function removeOpinion(Opinion $opinion): static
    {
        if ($this->opinions->removeElement($opinion)) {
            // set the owning side to null (unless already changed)
            if ($opinion->getCreatedBy() === $this) {
                $opinion->setCreatedBy(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, UserOpinionReaction>
     */
    public function getUserOpinionReactions(): Collection
    {
        return $this->userOpinionReactions;
    }

    public function addUserOpinionReaction(UserOpinionReaction $userOpinionReaction): static
    {
        if (!$this->userOpinionReactions->contains($userOpinionReaction)) {
            $this->userOpinionReactions->add($userOpinionReaction);
            $userOpinionReaction->setVoter($this);
        }

        return $this;
    }

    public function removeUserOpinionReaction(UserOpinionReaction $userOpinionReaction): static
    {
        if ($this->userOpinionReactions->removeElement($userOpinionReaction)) {
            // set the owning side to null (unless already changed)
            if ($userOpinionReaction->getVoter() === $this) {
                $userOpinionReaction->setVoter(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, RefreshToken>
     */
    public function getRefreshTokens(): Collection
    {
        return $this->refreshTokens;
    }

    public function addRefreshToken(RefreshToken $refreshToken): static
    {
        if (!$this->refreshTokens->contains($refreshToken)) {
            $this->refreshTokens->add($refreshToken);
            $refreshToken->setAssociatedUser($this);
        }

        return $this;
    }

    public function removeRefreshToken(RefreshToken $refreshToken): static
    {
        if ($this->refreshTokens->removeElement($refreshToken)) {
            // set the owning side to null (unless already changed)
            if ($refreshToken->getAssociatedUser() === $this) {
                $refreshToken->setAssociatedUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Product>
     */
    public function getProducts(): Collection
    {
        return $this->products;
    }

    public function addProduct(Product $product): static
    {
        if (!$this->products->contains($product)) {
            $this->products->add($product);
            $product->setCreator($this);
        }

        return $this;
    }

    public function removeProduct(Product $product): static
    {
        if ($this->products->removeElement($product)) {
            // set the owning side to null (unless already changed)
            if ($product->getCreator() === $this) {
                $product->setCreator(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Login>
     */
    public function getLogins(): Collection
    {
        return $this->logins;
    }

    public function addLogin(Login $login): static
    {
        if (!$this->logins->contains($login)) {
            $this->logins->add($login);
            $login->setAppuser($this);
        }

        return $this;
    }

    public function removeLogin(Login $login): static
    {
        if ($this->logins->removeElement($login)) {
            // set the owning side to null (unless already changed)
            if ($login->getAppuser() === $this) {
                $login->setAppuser(null);
            }
        }

        return $this;
    }
}
