<?php

namespace AppBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\Validator\Constraints as Assert;

use AppBundle\Entity\Instance;

class InstanceType extends AbstractType
{
    /**
     * {@inheritdoc}
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('type', 'choice', [
                'choices'  => ['boolean' => 'boolean', 'countdown' => 'countdown'],
                'mapped' => false,
                'error_bubbling' => false
            ])

            ->add('title', 'text', [
                'error_bubbling' => false
            ])

            ->add('createdBy', 'text', [
                'error_bubbling' => false
            ])

            ->add('textFalse', 'text', [
                'error_bubbling' => false
            ])
            ->add('textTrue', 'text', [
                'error_bubbling' => false
            ]);

            $builder->addEventListener(FormEvents::PRE_SUBMIT , function (FormEvent $event) {
                $form = $event->getForm();
                $reflect = new \ReflectionClass($form->getData());

                if (strtolower($reflect->getShortName()) === Instance::TYPE_COUNTDOWN) {

                    /*
                     * 'text' is used instead of 'datetime' as datetime has apparently trouble validating the ISO 8601 date format
                     */
                    $form->add('endAt', 'text', [
                        'error_bubbling' => false,
                        'constraints' => [
                            new Assert\NotBlank,
                            new Assert\Callback(function($date, $context) {
                                if (false === \DateTime::createFromFormat(\DateTime::ISO8601, $date)) {
                                    $context->addViolation("Ending date & time is invalid.");
                                }
                            })
                        ],
                    ]);

                    // Additional inputs for endAt
                    // https://github.com/symfony/symfony/issues/14712
                    $form->add('showTextFalse', 'choice', [
                        'choices' => array(
                            'Yes' => true,
                            'No' => false
                        ),
                        'choices_as_values' => true,
                        'choice_value' => function ($currentChoiceKey) {
                            return $currentChoiceKey ? 'true' : 'false';
                        },
                        'error_bubbling' => false
                    ]);
                    $form->add('useTimezone', 'choice', [
                        'choices' => array(
                            'Yes' => true,
                            'No' => false
                        ),
                        'choices_as_values' => true,
                        'choice_value' => function ($currentChoiceKey) {
                            return $currentChoiceKey ? 'true' : 'false';
                        },
                        'error_bubbling' => false
                    ]);
                }
            });
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            "allow_extra_fields" => true,
            'csrf_protection' => false,
            'validation_groups' => function (FormInterface $form) {
                $data = $form->get('type')->getData();
                return [ucfirst($data), 'Default'];
            }
        ));
    }

    public function getName() {
        return 'Instance';
    }
}
