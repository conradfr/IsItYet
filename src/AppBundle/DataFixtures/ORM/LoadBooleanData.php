<?php

namespace AppBundle\DataFixtures\ORM;

use Doctrine\Common\DataFixtures\FixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use AppBundle\Entity\Boolean;

class LoadBooleanData implements FixtureInterface
{
    /**
     * {@inheritDoc}
     */
    public function load(ObjectManager $manager)
    {
        $boolean = new Boolean();

        $boolean->setTitle("Est-ce que IsItYet est lancé ?");
        $boolean->setPublicKey(uniqid());
//        $boolean->setWriteKey(uniqid());

        $boolean->setStatus(false);

        $manager->persist($boolean);
        $manager->flush();
    }
}