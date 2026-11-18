import {
  IconBeach,
  IconBed,
  IconBinoculars,
  IconBus,
  IconBuildingSkyscraper,
  IconCalendarEvent,
  IconCar,
  IconCompass,
  IconDiscount,
  IconHome,
  IconLuggage,
  IconMap,
  IconMountain,
  IconPlane,
  IconRoute,
  IconShip,
  IconSparkles,
  IconTicket,
  IconTrain,
  IconUsers
} from '@tabler/icons-react';

const icons = {
  IconBeach,
  IconBed,
  IconBinoculars,
  IconBus,
  IconBuildingSkyscraper,
  IconCalendarEvent,
  IconCar,
  IconCompass,
  IconDiscount,
  IconHome,
  IconLuggage,
  IconMap,
  IconMountain,
  IconPlane,
  IconRoute,
  IconShip,
  IconSparkles,
  IconTicket,
  IconTrain,
  IconUsers
};

export function getIcon(name) {
  return icons[name] || IconCompass;
}
