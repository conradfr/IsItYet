<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

use AppBundle\Entity\Instance,
    AppBundle\Form\Type\InstanceType;

class SiteController extends Controller
{
    /**
     * @Route("/", name="home")
     * @Method({"GET"})
     */
    public function appAction()
    {
        return $this->render('default/index.html.twig');
    }
}
