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
     * Assert\DateTime()
     */
    private $endAt;

    /**
     * @var boolean
     *
     * @ORM\Column(name="use_timezone", type="boolean")
     */
    private $useTimezone = false;

    /**
     * @param \DateTime|string $endAt
     */
    public function setEndAt($endAt)
    {
        /*
         * As we do not rely on the datetime form input but text instead (cf comment in InstanType),
         * we transform the input string into a DateTime here
         */
        if (is_string($endAt)) {
            $endAt = new \DateTime($endAt);
        }

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
