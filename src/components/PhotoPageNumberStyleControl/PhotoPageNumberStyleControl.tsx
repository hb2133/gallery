import Styles from './PhotoPageNumberStyleControl.module.css';

interface PhotoPageNumberStyleControlProps
{
    Color: string;
    Disabled?: boolean;
    OnChangeColor: (Color: string) => void;
    OnChangeOpacity: (Opacity: number) => void;
    Opacity: number;
}

export function PhotoPageNumberStyleControl(
    Props: PhotoPageNumberStyleControlProps,
)
{
    const OpacityPercent = Math.round(Props.Opacity * 100);

    return (
        <section className={Styles.Root}>
            <div>
                <strong>페이지 번호</strong>
                <span>책넘김 하단 숫자의 색상과 투명도</span>
            </div>
            <div className={Styles.Controls}>
                <label>
                    <span>폰트 색상</span>
                    <input
                        type="color"
                        value={Props.Color}
                        disabled={Props.Disabled}
                        onChange={(Event) =>
                            Props.OnChangeColor(
                                Event.currentTarget.value,
                            )
                        }
                    />
                </label>
                <label className={Styles.OpacityControl}>
                    <span>투명도 {OpacityPercent}%</span>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={OpacityPercent}
                        disabled={Props.Disabled}
                        onChange={(Event) =>
                            Props.OnChangeOpacity(
                                Number(Event.currentTarget.value) / 100,
                            )
                        }
                    />
                </label>
            </div>
        </section>
    );
}
