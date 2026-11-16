import type { Schema, Struct } from '@strapi/strapi';

export interface CodexAnnouncement extends Struct.ComponentSchema {
  collectionName: 'components_codex_announcements';
  info: {
    description: 'A short notice on the Codex home. Remove the section to hide it.';
    displayName: 'Announcement';
    icon: 'bell';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CodexAppLink extends Struct.ComponentSchema {
  collectionName: 'components_codex_app_links';
  info: {
    description: 'A link that opens a page inside Silq. Path is the in-app route, such as /rfqs/new.';
    displayName: 'App link';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    path: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CodexBucketGrid extends Struct.ComponentSchema {
  collectionName: 'components_codex_bucket_grids';
  info: {
    description: "A grid of the sidebar buckets. Order follows each category's ordinal.";
    displayName: 'Bucket grid';
    icon: 'grid';
  };
  attributes: {
    heading: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Browse'>;
  };
}

export interface CodexCallout extends Struct.ComponentSchema {
  collectionName: 'components_codex_callouts';
  info: {
    description: 'A highlighted note inside an article. Tone picks the color: tip, warning, or info.';
    displayName: 'Callout';
    icon: 'bulb';
  };
  attributes: {
    body: Schema.Attribute.RichText & Schema.Attribute.Required;
    tone: Schema.Attribute.Enumeration<['tip', 'warning', 'info']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'info'>;
  };
}

export interface CodexFaqHighlights extends Struct.ComponentSchema {
  collectionName: 'components_codex_faq_highlights';
  info: {
    description: 'A short list of FAQs on the home. Limit is how many to show.';
    displayName: 'FAQ highlights';
    icon: 'question';
  };
  attributes: {
    heading: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Common questions'>;
    limit: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<4>;
  };
}

export interface CodexFeaturedWorkflows extends Struct.ComponentSchema {
  collectionName: 'components_codex_featured_workflows';
  info: {
    description: 'A row of workflow cards on the Codex home. Leave workflows empty to show every published workflow.';
    displayName: 'Featured workflows';
    icon: 'apps';
  };
  attributes: {
    heading: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Workflows'>;
    workflows: Schema.Attribute.Relation<'oneToMany', 'api::workflow.workflow'>;
  };
}

export interface CodexHero extends Struct.ComponentSchema {
  collectionName: 'components_codex_heroes';
  info: {
    description: 'The title band at the top of the Codex home.';
    displayName: 'Hero';
    icon: 'picture';
  };
  attributes: {
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CodexTourCta extends Struct.ComponentSchema {
  collectionName: 'components_codex_tour_ctas';
  info: {
    description: 'A button that starts an existing product tour. Pick the tour; the label is the button text.';
    displayName: 'Tour button';
    icon: 'play';
  };
  attributes: {
    label: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Show me in app'>;
    tour: Schema.Attribute.Relation<'oneToOne', 'api::tour.tour'>;
  };
}

export interface CodexVideo extends Struct.ComponentSchema {
  collectionName: 'components_codex_videos';
  info: {
    description: 'An embedded video. URL is a direct video file or a YouTube link.';
    displayName: 'Video';
    icon: 'play';
  };
  attributes: {
    caption: Schema.Attribute.String;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface CodexWorkflowStep extends Struct.ComponentSchema {
  collectionName: 'components_codex_workflow_steps';
  info: {
    description: 'One step in a workflow stepper. Label is the step name. Article is the document shown for that step.';
    displayName: 'Workflow step';
    icon: 'bulletList';
  };
  attributes: {
    article: Schema.Attribute.Relation<'oneToOne', 'api::article.article'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

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
    description: Schema.Attribute.RichText;
    imageUrl: Schema.Attribute.String;
    maskAssetUrl: Schema.Attribute.String;
    maskOffsetX: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    maskOffsetY: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    maskScale: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<1>;
    orderStep: Schema.Attribute.String;
    placement: Schema.Attribute.Enumeration<
      [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'center',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
      ]
    >;
    target: Schema.Attribute.String;
    title: Schema.Attribute.RichText;
  };
}

export interface TourLaunchTrigger extends Struct.ComponentSchema {
  collectionName: 'components_tour_launch_triggers';
  info: {
    displayName: 'Launch trigger';
  };
  attributes: {
    trigger: Schema.Attribute.Enumeration<['Route path', 'Anchor click']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Route path'>;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'codex.announcement': CodexAnnouncement;
      'codex.app-link': CodexAppLink;
      'codex.bucket-grid': CodexBucketGrid;
      'codex.callout': CodexCallout;
      'codex.faq-highlights': CodexFaqHighlights;
      'codex.featured-workflows': CodexFeaturedWorkflows;
      'codex.hero': CodexHero;
      'codex.tour-cta': CodexTourCta;
      'codex.video': CodexVideo;
      'codex.workflow-step': CodexWorkflowStep;
      'festivity.element': FestivityElement;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'tour-step.steps': TourStepSteps;
      'tour.launch-trigger': TourLaunchTrigger;
    }
  }
}
