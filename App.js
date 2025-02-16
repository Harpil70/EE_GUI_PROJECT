import React, { useState, useEffect } from 'react';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme, VictoryLegend } from 'victory';
import './App.css';

function App() {
  const [res1, setRes1] = useState();
  const [ind1, setInd1] = useState();
  const [cap1, setCap1] = useState();
  const [z1, setZ1] = useState('');
  const [current1, setCurrent1] = useState([]);

  const [res2, setRes2] = useState();
  const [ind2, setInd2] = useState();
  const [cap2, setCap2] = useState();
  const [z2, setZ2] = useState('');
  const [current2, setCurrent2] = useState([]);

  const [res3, setRes3] = useState();
  const [ind3, setInd3] = useState();
  const [cap3, setCap3] = useState();
  const [z3, setZ3] = useState('');
  const [current3, setCurrent3] = useState([]);

  const [V, setV] = useState(230);
  const [omega, setOmega] = useState(2 * Math.PI * 50);

  const [redVoltageData, setRedVoltageData] = useState([]);
  const [yellowVoltageData, setYellowVoltageData] = useState([]);
  const [blueVoltageData, setBlueVoltageData] = useState([]);

  const [activePowerData, setActivePowerData] = useState([]);
  const [reactivePowerData, setReactivePowerData] = useState([]);
  const [apparentPowerData, setApparentPowerData] = useState([]);
  const [instantaneousPowerData, setInstantaneousPowerData] = useState([]);

  const calculateImpedance = (res, ind, cap) => {
    const inductiveReactance = omega * Number(ind);
    const capacitiveReactance = cap ? (1 / (omega * Number(cap))) : 0;
    const impedance = Math.sqrt(
      Math.pow(Number(res), 2) + Math.pow(inductiveReactance - capacitiveReactance, 2)
    );
    return impedance;
  };

  const calculateCurrent = (voltage, impedance) => {
    return impedance ? voltage / impedance : 0;
  };

  useEffect(() => {
    const timeStep = 0.0001;
    const totalTime = (2 * 2 * Math.PI) / omega;
  
    const generateData = (amplitude, phaseShift) => {
      const data = [];
      for (let t = 0; t <= totalTime; t += timeStep) {
        const value = amplitude * Math.sin(omega * t + phaseShift);
        data.push({ x: t, y: value });
      }
      return data;
    };
  
    const impedance1 = calculateImpedance(res1, ind1, cap1);
    const impedance2 = calculateImpedance(res2, ind2, cap2);
    const impedance3 = calculateImpedance(res3, ind3, cap3);
  
    setZ1(impedance1.toFixed(2));
    setZ2(impedance2.toFixed(2));
    setZ3(impedance3.toFixed(2));
  
    const currentAmp1 = calculateCurrent(V, impedance1);
    const currentAmp2 = calculateCurrent(V, impedance2);
    const currentAmp3 = calculateCurrent(V, impedance3);
  
    setRedVoltageData(generateData(V, 0));
    setYellowVoltageData(generateData(V, -2 * Math.PI / 3));
    setBlueVoltageData(generateData(V, 2 * Math.PI / 3));
  
    setCurrent1(generateData(currentAmp1, 0));
    setCurrent2(generateData(currentAmp2, -2 * Math.PI / 3));
    setCurrent3(generateData(currentAmp3, 2 * Math.PI / 3));
  
    const powerCalculation = (voltage, current, phaseAngle) => {
      return {
        active: voltage * current * Math.cos(phaseAngle),
        reactive: voltage * current * Math.sin(phaseAngle),
        apparent: voltage * current,
        instantaneous: voltage * current * Math.sin(omega * totalTime)
      };
    };
  
    const redPower = powerCalculation(V, currentAmp1, 0);
    const yellowPower = powerCalculation(V, currentAmp2, -2 * Math.PI / 3);
    const bluePower = powerCalculation(V, currentAmp3, 2 * Math.PI / 3);
  
    setActivePowerData(generateData(redPower.active + yellowPower.active + bluePower.active, 0));
    setReactivePowerData(generateData(redPower.reactive + yellowPower.reactive + bluePower.reactive, 0));
    setApparentPowerData(generateData(redPower.apparent + yellowPower.apparent + bluePower.apparent, 0));
    setInstantaneousPowerData(generateData(redPower.instantaneous + yellowPower.instantaneous + bluePower.instantaneous, 0));
  
  }, [res1, ind1, cap1, res2, ind2, cap2, res3, ind3, cap3, V, omega]);
  

  return (
    <div className="App">
      <h1>
  <img src="https://imgs.search.brave.com/JQhkwcARloiubtYx41iohmQokoVi4IaDib1GlfGIUVU/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9zaGFy/bWF5YXNoYXN2aS5n/aXRodWIuaW8vY2xv/bmVfaWlpdHYtaWNk/L2ltYWdlcy9OZXct/TG9nby5wbmc" alt="IIITVICD Logo" className="logo" />
  IIIT-Vadodara - International Campus Diu.
</h1>
      <h1>3-Phase Circuit Analysis</h1>

      <div className="input-section">
        <label>Omega (ω): </label>
        <input type="number" value={omega} onChange={(e) => setOmega(Number(e.target.value))} />
      </div>

      <div className="input-section">
        <label>Voltage (V): </label>
        <input type="number" value={V} onChange={(e) => setV(Number(e.target.value))} />
      </div>

      {[['Red', res1, setRes1, ind1, setInd1, cap1, setCap1, z1],
        ['Yellow', res2, setRes2, ind2, setInd2, cap2, setCap2, z2],
        ['Blue', res3, setRes3, ind3, setInd3, cap3, setCap3, z3]].map(([color, res, setRes, ind, setInd, cap, setCap, z], index) => (
        <div key={index} className="input-section">
          <h2>{color} Wire</h2>
          <input type="number" placeholder="R (Ω)" value={res} onChange={(e) => setRes(Number(e.target.value))} />
          <input type="number" placeholder="L (H)" value={ind} onChange={(e) => setInd(Number(e.target.value))} />
          <input type="number" placeholder="C (F)" value={cap} onChange={(e) => setCap(Number(e.target.value))} />
          <p>Impedance: {z} Ω</p>
        </div>
      ))}

      <h2>Voltage vs Time (3-Phase)</h2>
      <VictoryChart theme={VictoryTheme.material} width={700} height={400}>
        <VictoryLegend x={125} y={10}
          orientation="horizontal"
          gutter={20}
          data={[{ name: "Red", symbol: { fill: "red" } }, { name: "Yellow", symbol: { fill: "gold" } }, { name: "Blue", symbol: { fill: "blue" } }]} />
        <VictoryAxis label="Time (s)" />
        <VictoryAxis dependentAxis label="Voltage (V)" />
        <VictoryLine data={redVoltageData} style={{ data: { stroke: "red" } }} />
        <VictoryLine data={yellowVoltageData} style={{ data: { stroke: "gold" } }} />
        <VictoryLine data={blueVoltageData} style={{ data: { stroke: "blue" } }} />
      </VictoryChart>

      <h2>Current vs Time (3-Phase)</h2>
      <VictoryChart theme={VictoryTheme.material} width={700} height={400}>
        <VictoryLegend x={125} y={10}
          orientation="horizontal"
          gutter={20}
          data={[{ name: "Red", symbol: { fill: "red" } }, { name: "Yellow", symbol: { fill: "gold" } }, { name: "Blue", symbol: { fill: "blue" } }]} />
        <VictoryAxis label="Time (s)" />
        <VictoryAxis dependentAxis label="Current (A)" />
        <VictoryLine data={current1} style={{ data: { stroke: "red" } }} />
        <VictoryLine data={current2} style={{ data: { stroke: "gold" } }} />
        <VictoryLine data={current3} style={{ data: { stroke: "blue" } }} />
      </VictoryChart>

      <h2>Power Analysis</h2>
      <VictoryChart theme={VictoryTheme.material} width={700} height={400}>
        <VictoryLegend x={125} y={10}
          orientation="horizontal"
          gutter={20}
          data={[{ name: "Active Power", symbol: { fill: "orange" } }, { name: "Reactive Power", symbol: { fill: "purple" } }, { name: "Apparent Power", symbol: { fill: "cyan" } }, { name: "Instantaneous Power", symbol: { fill: "green" } }]} />
        <VictoryAxis label="Time (s)" />
        <VictoryAxis dependentAxis label="Power (W/VAR/VA)" />
        <VictoryLine data={activePowerData} style={{ data: { stroke: "orange" } }} />
        <VictoryLine data={reactivePowerData} style={{ data: { stroke: "purple" } }} />
        <VictoryLine data={apparentPowerData} style={{ data: { stroke: "cyan" } }} />
        <VictoryLine data={instantaneousPowerData} style={{ data: { stroke: "green" } }} />
      </VictoryChart>
    </div>
  );
}

export default App;