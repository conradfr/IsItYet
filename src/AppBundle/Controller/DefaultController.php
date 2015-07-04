<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class DefaultController extends Controller
{
    /**
     * @Route("/instance", name="app")
     */
    public function indexAction()
    {
        return $this->render('default/app.html.twig');
    }
}
