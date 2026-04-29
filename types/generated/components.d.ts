import type { Schema, Struct } from '@strapi/strapi';

export interface FestivityElement extends Struct.ComponentSchema {
  collectionName: 'components_festivity_elements';
  info: {
    displayName: 'element';
    icon: 'brush';
  };
  attributes: {
    isActive: Schema.Attribute.Boolean;
    mediaUrl: Schema.Attribute.String;
    placement: Schema.Attribute.Enumeration<
      [
        'top',
        'right',
        'bottom',
        'left',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
        'center',
      ]
    >;
    viewPortHeight: Schema.Attribute.Decimal;
    viewPortWidth: Schema.Attribute.Decimal;
    visibleDuration: Schema.Attribute.Integer;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface TourStepSteps extends Struct.ComponentSchema {
  collectionName: 'components_tour_step_steps';
  info: {
    displayName: 'Step';
    icon: 'walk';
  };
  attributes: {
    cutoutBorderRadius: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<16>;
    cutoutPadding: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<13>;
    cutoutTarget: Schema.Attribute.String;
    description: Schema.Attribute.RichText;
    guidePosition: Schema.Attribute.Enumeration<
      ['right', 'bottom', 'left', 'top']
    > &
      Schema.Attribute.DefaultTo<'right'>;
    imageUrl: Schema.Attribute.String;
    maskAssetUrl: Schema.Attribute.String;
    maskOffsetX: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    maskOffsetY: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    maskScale: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<1>;
    orderStep: Schema.Attribute.String;
    placement: Schema.Attribute.String;
    target: Schema.Attribute.String;
    title: Schema.Attribute.RichText;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'festivity.element': FestivityElement;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'tour-step.steps': TourStepSteps;
    }
  }
}
