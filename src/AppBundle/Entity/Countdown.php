<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

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
     */
    private $endAt;

    /**
     * @var boolean
     *
     * @ORM\Column(name="use_timezone", type="boolean")
     */
    private $useTimezone;

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
