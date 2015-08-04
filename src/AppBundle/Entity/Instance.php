<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Context\ExecutionContextInterface;
use Rhumsaa\Uuid\Uuid;
use Rhumsaa\Uuid\Exception\UnsatisfiedDependencyException;
use Gedmo\Mapping\Annotation as Gedmo;
use JMS\Serializer\Annotation\Exclude;

/**
 * Instance
 *
 * @ORM\Entity
 * @ORM\Entity(repositoryClass="AppBundle\Entity\InstanceRepository")
 * @ORM\InheritanceType("SINGLE_TABLE")
 * @ORM\DiscriminatorColumn(name="type", type="string")
 * @ORM\HasLifecycleCallbacks
 */
class Instance
{
    const TYPE_BOOLEAN = 'boolean';
    const TYPE_COUNTDOWN = 'countdown';

    /**
     * @var integer
     *
     * @Exclude
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @Gedmo\Slug(fields={"title", "id"}, unique=true, updatable=false)
     * @ORM\Column(name="public_key", type="string")
     */
    private $publicKey;

    /**
     * @var string
     *
     * @Exclude
     * @ORM\Column(name="write_key", type="guid")
     */
    private $writeKey;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=50)
     * @Assert\NotBlank(message="A title is mandatory.")
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="created_by", type="string", length=25, nullable=true)
     * @Assert\Length(
     *      max = 25,
     *      maxMessage = "Your name is too long ({{ limit }} characters max }})"
     * )
     */
    private $createdBy;

    /**
     * @var string
     *
     * @ORM\Column(name="text_false", type="string", length=25)
     * @Assert\NotBlank(message="A status text is mandatory.")
     */
    private $textFalse = 'N0';

    /**
     * @var string
     *
     * @ORM\Column(name="text_true", type="string", length=25)
     * @Assert\NotBlank(message="A status text is mandatory.")
     */
    private $textTrue = 'YES';

    /**
     * @var \DateTime $created
     *
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @var \DateTime $updated
     *
     * @Gedmo\Timestampable(on="update")
     * @ORM\Column(type="datetime")
     */
    private $updatedAt;

    /** @ORM\PrePersist */
    public function createUuidOnPrePersist()
    {
        try {
            // Generate a version 4 (random) UUID object
            $uuid4 = Uuid::uuid4();
            $this->writeKey = $uuid4->toString();
        } catch (UnsatisfiedDependencyException $e) {
            echo 'Caught exception: ' . $e->getMessage() . "\n";
        }
    }

    /**
     * Instance can't be edited after 15 minutes of existence
     * @Assert\Callback
     */
    public function validate(ExecutionContextInterface $context)
    {
        // Execute only if already an instance
        if ($this->createdAt instanceof \DateTime) {
            $diffDate = $this->createdAt->diff(new \DateTime());

            $minutes = $diffDate->days * 24 * 60;
            $minutes += $diffDate->h * 60;
            $minutes += $diffDate->i;

            if ($minutes > 15) {
                $context->buildViolation("Settings can't be edited after 15 minutes.")
                    // ->atPath('firstName')
                    ->addViolation();
            }
        }
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param string $publicKey
     */
    public function setPublicKey($publicKey)
    {
        $this->publicKey = $publicKey;
    }

    /**
     * @return string
     */
    public function getPublicKey()
    {
        return $this->publicKey;
    }

    /**
     * @param string $writeKey
     */
    public function setWriteKey($writeKey)
    {
        $this->writeKey = $writeKey;
    }

    /**
     * @return string
     */
    public function getWriteKey()
    {
        return $this->writeKey;
    }

    /**
     * @param string $title
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }

    /**
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @return string
     */
    public function getCreatedBy()
    {
        return $this->createdBy;
    }

    /**
     * @param string $createdBy
     */
    public function setCreatedBy($createdBy)
    {
        $this->createdBy = $createdBy;
    }

    /**
     * @return string
     */
    public function getTextFalse()
    {
        return $this->textFalse;
    }

    /**
     * @param string $textFalse
     */
    public function setTextFalse($textFalse)
    {
        if (empty($textFalse)) { return; } // prevent form to overwrite with a null value so we can keep the default value
        $this->textFalse = $textFalse;
    }

    /**
     * @return string
     */
    public function getTextTrue()
    {
        return $this->textTrue;
    }

    /**
     * @param string $textTrue
     */
    public function setTextTrue($textTrue)
    {
        if (empty($textTrue)) { return; } // prevent form to overwrite with a null value so we can keep the default value
        $this->textTrue = $textTrue;
    }

    /**
     * @return \DateTime
     */
    public function getCreatedAt()
    {
        return $this->createdAt;
    }

    /**
     * @param \DateTime $createdAt
     */
    public function setCreatedAt($createdAt)
    {
        $this->createdAt = $createdAt;
    }

    /**
     * @return \DateTime
     */
    public function getUpdatedAt()
    {
        return $this->updatedAt;
    }

    /**
     * @param \DateTime $updatedAt
     */
    public function setUpdatedAt($updatedAt)
    {
        $this->updatedAt = $updatedAt;
    }
}
