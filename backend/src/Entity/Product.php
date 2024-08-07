<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
#[UniqueEntity(fields: ['barcode'], message: 'There is already a product with this EAN')]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $ProductName = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $Description = null;

    #[ORM\Column(length: 255)]
    private ?string $Image = null;

    #[ORM\ManyToOne(inversedBy: 'products')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Category $Category = null;

    #[ORM\OneToMany(mappedBy: 'product', targetEntity: Opinion::class, cascade: ['remove'] , orphanRemoval: true)]
    private Collection $opinions;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $barcode = null;

    #[ORM\Column(length: 255)]
    private ?string $producer = null;

    #[ORM\OneToMany(mappedBy: 'product', targetEntity: Warranty::class, orphanRemoval: true)]
    private Collection $warranties;

    #[ORM\Column(nullable: true)]
    private ?bool $inspected = null;

    #[ORM\ManyToOne(inversedBy: 'products')]
    private ?User $creator = null;

    public function __construct()
    {
        $this->opinions = new ArrayCollection();
        $this->warranties = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getProductName(): ?string
    {
        return $this->ProductName;
    }

    public function setProductName(string $ProductName): static
    {
        $this->ProductName = $ProductName;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->Description;
    }

    public function setDescription(?string $Description): static
    {
        $this->Description = $Description;

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->Image;
    }

    public function setImage(string $Image): static
    {
        $this->Image = $Image;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->Category;
    }

    public function setCategory(?Category $Category): static
    {
        $this->Category = $Category;

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
            $opinion->setProduct($this);
        }

        return $this;
    }

    public function removeOpinion(Opinion $opinion): static
    {
        if ($this->opinions->removeElement($opinion)) {
            // set the owning side to null (unless already changed)
            if ($opinion->getProduct() === $this) {
                $opinion->setProduct(null);
            }
        }

        return $this;
    }

    public function getBarcode(): ?string
    {
        return $this->barcode;
    }

    public function setBarcode(string $barcode): static
    {
        $this->barcode = $barcode;

        return $this;
    }

    public function getProducer(): ?string
    {
        return $this->producer;
    }

    public function setProducer(string $producer): static
    {
        $this->producer = $producer;

        return $this;
    }

    /**
     * @return Collection<int, Warranty>
     */
    public function getWarranties(): Collection
    {
        return $this->warranties;
    }

    public function addWarranty(Warranty $warranty): static
    {
        if (!$this->warranties->contains($warranty)) {
            $this->warranties->add($warranty);
            $warranty->setProduct($this);
        }

        return $this;
    }

    public function removeWarranty(Warranty $warranty): static
    {
        if ($this->warranties->removeElement($warranty)) {
            // set the owning side to null (unless already changed)
            if ($warranty->getProduct() === $this) {
                $warranty->setProduct(null);
            }
        }

        return $this;
    }

    public function isInspected(): ?bool
    {
        return $this->inspected;
    }

    public function setInspected(?bool $inspected): static
    {
        $this->inspected = $inspected;

        return $this;
    }

    public function getCreator(): ?User
    {
        return $this->creator;
    }

    public function setCreator(?User $creator): static
    {
        $this->creator = $creator;

        return $this;
    }
}
