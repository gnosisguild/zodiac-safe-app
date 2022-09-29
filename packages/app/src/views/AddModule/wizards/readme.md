# Zodiac Module Wizards

Wizards for setting up and attaching Zodiac Modules to a Safe. The wizards can either be displayed in a Modal or use the whole right side screen view.

In both cases, the a `ModuleButton` for the new wizard must be added to the `AddModule/index.tsx` file.

## Modal

Wizards can be displayed in a Modal using the `AddModuleModal` component and adding the Modal to `ModalWizards` component. An example of this is the `DelayModule` wizard.

## Full view

Wizards can also take up the whole right side view (man view). An example of this is the `RealityModule` wizard.
