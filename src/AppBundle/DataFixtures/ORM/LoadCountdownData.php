<?php

namespace AppBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Entity\Countdown;

class LoadCountdownData implements FixtureInterface
{
    /**
     * {@inheritDoc}
     */
    public function load(ObjectManager $manager)
    {
        $countdown = new Countdown();

        $countdown->setTitle("Fin de cette instance");
        $countdown->setPublicKey(uniqid());
//        $countdown->setWriteKey(uniqid());

        $countdown->setEndAt(new \DateTime('2015-07-14T20:00:00+0000'));

        $manager->persist($countdown);
        $manager->flush();
    }
}