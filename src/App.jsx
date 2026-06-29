import { useMemo, useState } from "react";
import { AppLayout } from "./layout/AppLayout";
import { Body } from "./screens/Body";
import { Habits } from "./screens/Habits";
import { Mind } from "./screens/Mind";
import { Profile } from "./screens/Profile";
import { Settings } from "./screens/Settings";
import { Sobriety } from "./screens/Sobriety";
import { Today } from "./screens/Today";
import { useAppData } from "./hooks/useAppData";

export default function App() {
  const [active, setActive] = useState("today");
  const data = useAppData();

  const screen = useMemo(() => {
    const screens = {
      today: <Today data={data} setActive={setActive} />,
      sobriety: <Sobriety trackers={data.trackers} setTrackers={data.setTrackers} />,
      mind: <Mind moods={data.moods} setMoods={data.setMoods} journals={data.journals} setJournals={data.setJournals} health={data.health} setHealth={data.setHealth} />,
      body: (
        <Body
          health={data.health}
          setHealth={data.setHealth}
          weights={data.weights}
          setWeights={data.setWeights}
          heightFt={data.heightFt}
          setHeightFt={data.setHeightFt}
          heightIn={data.heightIn}
          setHeightIn={data.setHeightIn}
          weight={data.weight}
          setWeight={data.setWeight}
          bmi={data.bmi}
          bmiCategory={data.bmiCategory}
        />
      ),
      habits: <Habits habits={data.habits} setHabits={data.setHabits} />,
      profile: <Profile trackers={data.trackers} moods={data.moods} journals={data.journals} habits={data.habits} weightGoal={data.weightGoal} setWeightGoal={data.setWeightGoal} />,
      settings: <Settings settings={data.settings} setSettings={data.setSettings} />,
    };

    return screens[active] || screens.today;
  }, [active, data]);

  return (
    <AppLayout active={active} setActive={setActive} settings={data.settings} setSettings={data.setSettings}>
      {screen}
    </AppLayout>
  );
}
