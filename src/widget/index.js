import { config } from 'Services/container';
import FontService from 'Services/fonts';
import AutoscaleService from 'Services/autoscale';
import AdaptiveService from 'Services/adaptive';

config.service('Fonts', FontService, 'Skin');
config.service('Autoscale', AutoscaleService, 'autoscale');
config.service('Adaptive', AdaptiveService, 'adaptive');

// define the declarative map of properties for dynamic content
config.constant('declarativeMap', {
  image: 'src',
  imageDescription: 'alt',
});

import WidgetBase from '@widgetic/components/widget';
import MainComponent from './Index.svelte';

export default class Widget extends WidgetBase {
  getComponent() {
    return MainComponent;
  }

  // widget's api public functions
  getPublicMethods() {
    return ['publicFunction1', 'publicFunction2'];
  }

  // widget's api public events
  getPublicEvents() {
    return ['init', 'beforeChange', 'afterChange'];
  }
}
