<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Countdown instance
 *
 * @ORM\Entity(repositoryClass="AppBundle\Entity\InstanceRepository")
 */
class Countdown extends Instance
{
    /**
     * @var \DateTime
     *
     * @ORM\Column(name="end_at", type="datetimetz")
     * @Assert\DateTime()
     */
    private $endAt;

    /**
     * @var boolean
     *
     * @ORM\Column(name="use_timezone", type="boolean")
     */
    private $useTimezone = false;

    /**
     * @param \DateTime $endAt
     */
    public function setEndAt($endAt)
    {
        $this->endAt = $endAt;
    }

    /**
     * @return \DateTime
     */
    public function getEndAt()
    {
        return $this->endAt;
    }

    /**
     * @param boolean $useTimezone
     */
    public function setUseTimezone($useTimezone)
    {
        $this->useTimezone = $useTimezone;
    }

    /**
     * @return boolean
     */
    public function getUseTimezone()
    {
        return $this->useTimezone;
    }


}
