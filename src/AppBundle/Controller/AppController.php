<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpFoundation\Cookie;
use AppBundle\Controller\BruteForceProtectionController;

use AppBundle\Entity\Instance,
    AppBundle\Entity\Boolean as InstanceBoolean,
    AppBundle\Form\Type\InstanceType;

/**
 * @Route("/instance")
 */
class AppController extends Controller implements BruteForceProtectionController
{
     /**
     * @Route("/{publicKey}/{writeKey}", name="app", defaults={"publicKey"="", "writeKey"=""})
     * @Method({"GET"})
     */
    public function appAction($publicKey, $writeKey, Request $request)
    {
        $responseData = [];

        // Dispatch or get instance data based on optional keys
        if ((!empty($publicKey)) && (empty($writeKey))) {
            return $this->forward('AppBundle:Site:view', ['publicKey' => $publicKey]);
        }
        elseif ((!empty($publicKey)) && (!empty($writeKey))) {
            $instance = $this->getDoctrine()->getRepository('AppBundle:Instance')->findOneBy(['publicKey' => $publicKey, 'writeKey' => $writeKey]);

            if (!$instance) {
                $this->addToAntiBruteForce($request);
                throw $this->createNotFoundException('The requested instance has not been found.');
            }

//          $responseData['instance'] = $instance;
            $responseData['instance'] = $this->getDoctrine()->getRepository('AppBundle:Instance')->getExportableInstance($instance, true);
        }

        return $this->render('default/app.html.twig', $responseData);
    }

    /**
     * @Route("/{whatever}", name="instance_submit", defaults={"whatever"=""})
     * @Method({"POST"})
     *
     * note: it seems a route w/ only "/" is not parsed by Symfony2, hence putting an unused optional parameter
     */
    public function submitAction(Request $request)
    {
        // Type validation (pre-form)
        $instanceTypeParam = $request->request->get('type', '');
        $typeConstraint = new Assert\Choice();
        $typeConstraint->choices = [Instance::TYPE_BOOLEAN, Instance::TYPE_COUNTDOWN];

        $instanceTypeError = $this->get('validator')->validate(
            $instanceTypeParam,
            $typeConstraint
        );

        if (count($instanceTypeError) > 0) {
            throw $this->createAccessDeniedException('Error');
        }

        $response = new JsonResponse();
        $responseData = [];

        $instanceTypeClass = "AppBundle\\Entity\\" . ucfirst($instanceTypeParam);
        $instance = new $instanceTypeClass();

        $form = $this->createForm(new instanceType(), $instance);

        $form->submit($request->request->all());

        if ($form->isValid()) {
            $instance->setLastIpAddress($request->getClientIp()); // @todo replace with Iptraceable once DoctrineExtensions Bundle add support

            $em = $this->getDoctrine()->getManager();
            $em->persist($instance);
            $em->flush();

            // Construct response
            $responseData = $this->getDoctrine()->getRepository('AppBundle:Instance')->getExportableInstance($instance, true);
            $response->setData($responseData);

            // Add cookie
            $this->addOrUpdateCookie($response, $instance);
        }
        else {
            $response->setStatusCode(400)
                ->setData([
                    // send normalized data
                    'data' => [
                        'title' => $instance->getTitle(),
                        'textFalse' => $instance->getTextFalse(),
                        'textTrue' => $instance->getTextTrue(),
                        'createdBy' => $instance->getCreatedBy(),
                    ],
                    'status' => [
                        'isCreated' => false,
                        'isDeleted' => false,
                        'hasErrors' => true,
                        'errors' => $this->get('form_serializer')->serializeFormErrors($form, false, false)
                    ]
                ]);
        }

        return $response;
    }

    /**
     * @Route("/{publicKey}/{writeKey}", name="instance_edit")
     * @Method({"POST"})
     */
    public function editAction($publicKey, $writeKey, Request $request)
    {
        $doctrine = $this->getDoctrine();

        $baseInstance = $doctrine->getRepository('AppBundle:Instance')->findOneBy(['publicKey' => $publicKey, 'writeKey' => $writeKey]);
        if (!$baseInstance) {
            $this->addToAntiBruteForce($request);
            throw $this->createNotFoundException('The requested instance has not been found.');
        }

        $response = new JsonResponse();
        $responseData = [];

        $type = $doctrine->getRepository('AppBundle:Instance')->getInstanceType($baseInstance);

        $instance = $doctrine->getRepository('AppBundle:' . ucfirst($type))->findOneBy(['publicKey' => $publicKey, 'writeKey' => $writeKey]);
        unset($type, $baseInstance);

        $form = $this->createForm(new instanceType(), $instance);

        $form->submit($request->request->all());

        if ($form->isValid()) {
            $instance->setLastIpAddress($request->getClientIp()); // @todo replace with Iptraceable once DoctrineExtensions Bundle add support

            $em = $this->getDoctrine()->getManager();
            $em->persist($instance);
            $em->flush();

            // Construct response
            $responseData = $this->getDoctrine()->getRepository('AppBundle:Instance')->getExportableInstance($instance);

            $serializer = $this->get('jms_serializer');

            /** @var \Predis\Client */
            $redis = $this->container->get('snc_redis.default');
            $redis->PUBLISH($instance->getPublicKey(), $serializer->serialize($responseData, 'json'));

            $response->setData($responseData);

            // Update cookie
            $this->addOrUpdateCookie($response, $instance);
        }
        else {
            $response->setStatusCode(400)
                ->setData([
                    // send normalized data
                    'data' => [
                        'title' => $instance->getTitle(),
                        'textFalse' => $instance->getTextFalse(),
                        'textTrue' => $instance->getTextTrue(),
                    ],
                    'status' => [
                        'isCreated' => false,
                        'isDeleted' => false,
                        'hasErrors' => true,
                        'errors' => $this->get('form_serializer')->serializeFormErrors($form, false, false)
                    ]
                ]);
        }

        return $response;

    }

    /**
     * @Route("/status/{publicKey}/{writeKey}", name="instance_status_update")
     * @Method({"POST"})
     */
    public function statusUpdateAction($publicKey, $writeKey, Request $request)
    {
        $content = $request->getContent();
        if (!empty($content)) {
            $statusParam = json_decode($content, true)['status']; // 2nd param to get as array
        }

        // Status type validation (boolean)
        $typeConstraint = new Assert\Type(array(
            'type'    => 'boolean'
        ));

        $typeError = $this->get('validator')->validate(
            $statusParam,
            $typeConstraint
        );

        if (count($typeError) > 0) {
            throw new BadRequestHttpException("Invalid status");
        }

        $em = $this->getDoctrine()->getManager();
        $response = new JsonResponse();
        $responseData = [];

        /** @var InstanceBoolean $instance */
        $instance = $this->getDoctrine()->getRepository('AppBundle:Boolean')->findOneBy(['publicKey' => $publicKey, 'writeKey' => $writeKey]);

        if (!$instance) {
            $this->addToAntiBruteForce($request);
            $response->setStatusCode(404);
        } else {
            $instance->setLastIpAddress($request->getClientIp()); // @todo replace with Iptraceable once DoctrineExtensions Bundle add support
            $instance->setStatus($statusParam);
            $em->flush();

            $responseData = [
                'data' => ['status' => $statusParam],
                'status' => [
                    'hasErrors' => false,
                    'isStatusUpdated' => true
                ]
            ];
            $serializer = $this->get('jms_serializer');

            /** @var \Predis\Client */
            $redis = $this->container->get('snc_redis.default');
            $redis->PUBLISH($instance->getPublicKey(), $serializer->serialize($responseData, 'json'));

            $response->setData($responseData);
        }

        return $response;
    }

    /**
     * @Route("/delete/{publicKey}/{writeKey}", name="instance_delete")
     */
    public function deleteAction($publicKey, $writeKey, Request $request)
    {
        $em = $this->getDoctrine()->getManager();

        $response = new JsonResponse();
        $responseData = [];

        $instance = $this->getDoctrine()->getRepository('AppBundle:Instance')->findOneBy(['publicKey' => $publicKey, 'writeKey' => $writeKey]);

        if (!$instance) {
            $this->addToAntiBruteForce($request);
            $response->setStatusCode(404);
        }
        elseif($instance->isIsDemo() === true) {
            $response->setStatusCode(400);
            $responseData = [
                'status' => [
                    'hasErrors' => false,
                    'errors' => [
                      'delete' => "Demo pages can't be deleted."
                    ],
                    'isDeleted' => false
                ]
            ];
        }
        else {
            // Remove cookie
            $this->deleteCookie($response, $instance);

            $em->remove($instance);
            $em->flush();

            $responseData = [
                    'status' => [
                        'hasErrors' => false,
                        'isDeleted' => true
                    ]
                ];

            $serializer = $this->get('jms_serializer');

            /** @var \Predis\Client */
            $redis = $this->container->get('snc_redis.default');
            $redis->PUBLISH($instance->getPublicKey(), $serializer->serialize($responseData, 'json'));
        }

        $response->setData($responseData);
        return $response;
    }

    /**
     * Ban any IP that accessed any editable actions with an invalid public and/or write key, for two seconds,
     * to prevent someone bruteforcing the write key
     * @param Request $request
     */
    protected function addToAntiBruteForce(Request $request) {
        /** @var \Predis\Client */
        $redis = $this->container->get('snc_redis.default');
        $redis->SET('bruteforce_' . $request->getClientIp(), $request->getClientIp(), 'EX', 2);
    }

    /**
     * Add or update the instance cookie
     *
     * The cookie is used to store the public & write key and allows the top right menu
     *
     * @param JsonResponse $response
     * @param Instance $instance
     */
    protected function addOrUpdateCookie(JsonResponse $response,Instance $instance) {
        $cookieContent = $instance->getWriteKey();
        $cookieContent .= (strlen($instance->getTitle()) > 40) ? substr($instance->getTitle(), 0, 36) . ' ...' : $instance->getTitle();

        $response->headers->setCookie(new Cookie('instance[' . $instance->getPublicKey() . ']', $cookieContent, time() + (3600 * 24 * 365), '/', null, false, false));
    }

    /**
     * @param JsonResponse $response
     * @param Instance $instance
     */
    protected function deleteCookie(JsonResponse $response,Instance $instance) {
        $response->headers->clearCookie('instance[' . $instance->getPublicKey() . ']');
    }
}
