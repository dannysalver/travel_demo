import {
  IconBed,
  IconBinoculars,
  IconBus,
  IconCalendarEvent,
  IconCar,
  IconDiscount,
  IconLuggage,
  IconMap,
  IconMountain,
  IconPlane,
  IconRoute,
  IconShieldCheck,
  IconSparkles,
  IconTicket,
  IconTrain,
  IconUsers
} from '@tabler/icons-react';

export const defaultWhyBook = {
  subtitle: 'Straightforward search, honest prices and a team that actually picks up the phone.',
  points: [
    { icon: IconDiscount, title: 'Best price promise', body: 'Compare trusted providers and keep more of your travel budget.' },
    { icon: IconSparkles, title: 'Real human support', body: 'Our travel specialists are here before, during and after your trip.' },
    { icon: IconLuggage, title: 'Secure booking', body: 'Simple, transparent payments with no hidden fees at checkout.' },
    { icon: IconRoute, title: 'Flexible plans', body: 'Free cancellation on hundreds of stays, tours and tickets.' }
  ]
};

export const whyBookByCategory = {
  'hotels-homes': {
    subtitle: 'Handpicked stays, clear prices and the little details that make a place feel like yours.',
    points: [
      {
        icon: IconBed,
        title: 'Stays with character',
        body: 'From city hideaways to beachfront villas, every place is chosen for a reason.'
      },
      { icon: IconCalendarEvent, title: 'Room to change plans', body: 'Filter for flexible rates and book a stay that can move with you.' },
      { icon: IconDiscount, title: 'Honest nightly rates', body: 'See the full price up front, with no surprise fees at checkout.' },
      { icon: IconMap, title: 'The right neighbourhood', body: 'Location notes help you find the right corner of town, not just a bed.' }
    ]
  },
  flights: {
    subtitle: 'Compare routes, catch the right fare and fly with the details already sorted.',
    points: [
      { icon: IconPlane, title: 'Fares in one view', body: 'Scan airlines, departure times and prices side by side before you commit.' },
      { icon: IconCalendarEvent, title: 'Flexible date hunting', body: 'Shift your departure by a day or two and often save a bundle.' },
      { icon: IconLuggage, title: 'Baggage made clear', body: 'See what each fare includes so there are no surprises at the airport.' },
      { icon: IconShieldCheck, title: 'Changes handled', body: 'We show the rules up front and help when plans need to move.' }
    ]
  },
  trains: {
    subtitle: 'Window-seat journeys, simple fares and rail routes worth slowing down for.',
    points: [
      { icon: IconTrain, title: 'Every route, one search', body: 'Compare operators and timetables without hopping between sites.' },
      { icon: IconMountain, title: 'Journeys with a view', body: 'Find routes that turn travel time into part of the adventure.' },
      { icon: IconTicket, title: 'Fares explained', body: 'Know what is included, from seat reservations to flexible tickets.' },
      { icon: IconRoute, title: 'Easy connections', body: 'Plan transfers with clear times so you arrive relaxed.' }
    ]
  },
  cars: {
    subtitle: 'The right wheels, the right price and the freedom to take the scenic route.',
    points: [
      { icon: IconCar, title: 'A car for every plan', body: 'From compact city runs to roomy SUVs, compare vehicles that fit your trip.' },
      { icon: IconDiscount, title: 'No hidden extras', body: 'Insurance and add-ons are spelled out before you confirm.' },
      { icon: IconMap, title: 'Pick up where you land', body: 'Collect at airports, stations or in town and start driving sooner.' },
      { icon: IconShieldCheck, title: 'Drive with cover', body: 'See the protection included with every booking at a glance.' }
    ]
  },
  buses: {
    subtitle: 'Budget-friendly routes, clear timetables and comfortable seats for the long haul.',
    points: [
      { icon: IconBus, title: 'Routes that reach further', body: 'Find connections to places the trains and planes often skip.' },
      { icon: IconDiscount, title: 'Fares that make sense', body: 'Compare prices across operators and keep more in your pocket.' },
      { icon: IconUsers, title: 'Seats together', body: 'Book for a group and we will keep your seats side by side.' },
      { icon: IconCalendarEvent, title: 'Times you can trust', body: 'Check departures and arrivals before you pack.' }
    ]
  },
  'attractions-tours': {
    subtitle: 'Skip the guesswork and spend your time on the good part: being there.',
    points: [
      { icon: IconTicket, title: 'Walk past the queue', body: 'Book ahead and step straight into the experience.' },
      { icon: IconBinoculars, title: 'Local stories', body: 'Meet the people who know what makes each place special.' },
      { icon: IconCalendarEvent, title: 'Pick your moment', body: 'Choose a time that fits your day, not the other way around.' },
      { icon: IconSparkles, title: 'Something for everyone', body: 'From museum mornings to sunset cruises, find your kind of day.' }
    ]
  },
  'flight-hotel': {
    subtitle: 'One booking for the flight and the stay, with less to juggle and more to enjoy.',
    points: [
      { icon: IconPlane, title: 'Flight and stay together', body: 'Match your arrival time to a place that is ready when you are.' },
      { icon: IconDiscount, title: 'Bundle savings', body: 'Booking both at once often costs less than booking separately.' },
      { icon: IconLuggage, title: 'One simple itinerary', body: 'Every detail in one place, from takeoff to check-out.' },
      { icon: IconShieldCheck, title: 'Support in one place', body: 'If plans shift, we look at the whole trip, not just one part.' }
    ]
  },
  events: {
    subtitle: 'Find the nights you will talk about later, with tickets and travel plans in one place.',
    points: [
      { icon: IconCalendarEvent, title: 'Dates worth saving', body: 'See what is on and when, from weekends away to one-off shows.' },
      { icon: IconTicket, title: 'Tickets in hand', body: 'Book ahead and know exactly where you will be.' },
      { icon: IconMap, title: 'Get there easily', body: 'Check the venue and its surroundings before you travel.' },
      { icon: IconSparkles, title: 'Make a night of it', body: 'Pair the event with a place to stay and turn it into a trip.' }
    ]
  }
};
