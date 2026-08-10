'use client';

import { PanelLayerHost } from '@/app/panel_layer/PanelLayerHost';
import { PageCustomizationLayeredPanel } from '@/panels/layered/PageCustomizationLayeredPanel/PageCustomizationLayeredPanel';
import { StartPageCustomizationLayeredPanel } from '@/panels/layered/StartPageCustomizationLayeredPanel/StartPageCustomizationLayeredPanel';
import { StartPageLinkLayeredPanel } from '@/panels/layered/StartPageLinkLayeredPanel/StartPageLinkLayeredPanel';
import { StartPageMessageLayeredPanel } from '@/panels/layered/StartPageMessageLayeredPanel/StartPageMessageLayeredPanel';
import { useGalleryBasePanelController } from './controller/GalleryBasePanelController';
import { HeaderSection } from './sections/HeaderSection/HeaderSection';
import { HeroSection } from './sections/HeroSection/HeroSection';
import Styles from './GalleryBasePanel.module.css';

export function GalleryBasePanel()
{
    const Controller = useGalleryBasePanelController();
    const HeroCustomization =
        Controller.EditingBoxLayoutCategory === null
            ? Controller.StartCustomization
            : Controller.DraftCustomization;

    return (
        <main
            className={Styles.PageRoot}
            data-ue-page="GalleryBasePanel"
        >
            <HeaderSection
                IsDarkTheme={Controller.IsDarkTheme}
                MessageRotationSeconds={
                    Controller.StartCustomization
                        .DailyMessageRotationSeconds
                }
                Messages={
                    Controller.IsStartCustomizationLoaded
                        ? Controller.StartCustomization.DailyMessages
                        : []
                }
                HeaderLink={
                    Controller.IsStartCustomizationLoaded
                        ? Controller.StartCustomization.HeaderLink
                        : null
                }
                OnOpenCustomization={Controller.OpenCustomization}
                OnToggleTheme={Controller.ToggleTheme}
            />
            <HeroSection
                ActiveCategory={Controller.ActiveHeroCategory}
                IsClosing={Controller.IsHeroClosing}
                OnSelectCategory={Controller.SelectHeroCategory}
                OnReset={Controller.ResetHeroCategory}
                OnOpenDestination={Controller.OpenBoxDestination}
                EditingBoxLayoutCategory={
                    Controller.EditingBoxLayoutCategory
                }
                SelectedBoxLayoutCell={
                    Controller.SelectedBoxLayoutCell
                }
                OnSelectBoxLayoutCell={
                    Controller.SelectBoxLayoutCell
                }
                OnMoveBoxLayoutCell={
                    Controller.MoveBoxLayoutCell
                }
                OnFinishBoxLayoutEditing={
                    Controller.FinishBoxLayoutEditing
                }
                CategoryLabels={
                    HeroCustomization.CategoryLabels
                }
                CategoryBoxLayouts={
                    HeroCustomization.CategoryBoxLayouts
                }
                CategoryImages={
                    HeroCustomization.CategoryImages
                }
                CategoryTextStyles={
                    HeroCustomization.CategoryTextStyles
                }
                CategoryCenterTextStyles={
                    HeroCustomization.CategoryCenterTextStyles
                }
                DestinationLabels={
                    HeroCustomization.DestinationLabels
                }
                DestinationTextStyles={
                    HeroCustomization.DestinationTextStyles
                }
            />
            <PanelLayerHost>
                {Controller.CustomizationView === 'menu' ? (
                    <PageCustomizationLayeredPanel
                        Kind="start"
                        OnRequestClose={
                            Controller.CloseCustomization
                        }
                        OnSelectOption={
                            Controller.OpenCustomizationOption
                        }
                    />
                ) : null}
                {Controller.CustomizationView === 'categories' ? (
                    <StartPageCustomizationLayeredPanel
                        Customization={
                            Controller.DraftCustomization
                        }
                        IsSaving={
                            Controller.IsCustomizationSaving
                        }
                        Notice={Controller.CustomizationNotice}
                        UploadingCategory={
                            Controller.UploadingCategory
                        }
                        OnChangeLabel={
                            Controller.UpdateCategoryLabel
                        }
                        OnChangeCategoryTextStyle={
                            Controller.UpdateCategoryTextStyle
                        }
                        OnChangeCategoryCenterTextStyle={
                            Controller.UpdateCategoryCenterTextStyle
                        }
                        OnMoveBoxLayoutCell={
                            Controller.MoveBoxLayoutCell
                        }
                        OnChangeDestinationLabel={
                            Controller.UpdateDestinationLabel
                        }
                        OnChangeDestinationTextStyle={
                            Controller.UpdateDestinationTextStyle
                        }
                        OnBack={
                            Controller.ReturnToCustomizationMenu
                        }
                        OnRequestClose={
                            Controller.CloseCustomization
                        }
                        OnSave={Controller.SaveCustomization}
                        OnSelectImage={
                            Controller.UploadCategoryImage
                        }
                    />
                ) : null}
                {Controller.CustomizationView === 'messages' ? (
                    <StartPageMessageLayeredPanel
                        IsSaving={
                            Controller.IsCustomizationSaving
                        }
                        Messages={
                            Controller.DraftCustomization
                                .DailyMessages
                        }
                        RotationSeconds={
                            Controller.DraftCustomization
                                .DailyMessageRotationSeconds
                        }
                        Notice={Controller.CustomizationNotice}
                        OnAddMessage={
                            Controller.AddDailyMessage
                        }
                        OnBack={
                            Controller.ReturnToCustomizationMenu
                        }
                        OnChangeMessage={
                            Controller.UpdateDailyMessage
                        }
                        OnRemoveMessage={
                            Controller.RemoveDailyMessage
                        }
                        OnChangeRotationSeconds={
                            Controller.UpdateDailyMessageRotationSeconds
                        }
                        OnRequestClose={
                            Controller.CloseCustomization
                        }
                        OnSave={Controller.SaveCustomization}
                    />
                ) : null}
                {Controller.CustomizationView === 'link' ? (
                    <StartPageLinkLayeredPanel
                        IsSaving={
                            Controller.IsCustomizationSaving
                        }
                        Link={
                            Controller.DraftCustomization.HeaderLink
                        }
                        Notice={Controller.CustomizationNotice}
                        OnBack={
                            Controller.ReturnToCustomizationMenu
                        }
                        OnChangeText={
                            Controller.UpdateHeaderLinkText
                        }
                        OnChangeUrl={
                            Controller.UpdateHeaderLinkUrl
                        }
                        OnRequestClose={
                            Controller.CloseCustomization
                        }
                        OnSave={Controller.SaveCustomization}
                    />
                ) : null}
            </PanelLayerHost>
        </main>
    );
}
