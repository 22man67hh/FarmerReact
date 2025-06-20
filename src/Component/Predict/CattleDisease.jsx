import React, { useState } from 'react';
import axios from 'axios';
import { DEEPSEEK_API } from '../Config/api';

const symptomsList = [
  'anorexia/भोक नलाग्ने',
  'abdominal_pain/पेट दुखाइ',
  'anaemia/रक्ताल्पता',
  'abortions/गर्भपतन',
  'acetone/एसिटोन',
  'aggression/आक्रमण',
  'arthrogyposis/अस्थि विकृति',
  'ankylosis/जोड कठोरता',
  'anxiety/चिन्ता',
  'bellowing/रुन थर्किने',
  'blood_loss/रक्तस्राव',
  'blood_poisoning/रक्त विषाक्तता',
  'blisters/पखाला',
  'colic/पेट दुखाइ',
  'Condemnation_of_livers/यकृत क्षति',
  'conjunctivae/आँखा श्लेष्मा',
  'coughing/खोकी',
  'depression/उदासी',
  'discomfort/असजिलो',
  'dyspnea/सास फेर्न गाह्रो',
  'dysentery/पखाला',
  'diarrhoea/दस्त',
  'dehydration/पानी कमी',
  'drooling/थुक बग्नु',
  'dull/निस्तेज',
  'decreased_fertility/प्रजनन क्षमता घट्नु',
  'diffculty_breath/सास फेर्न कठिनाइ',
  'emaciation/कुपोषण',
  'encephalitis/मस्तिष्क शोथ',
  'fever/ज्वरो',
  'facial_paralysis/अनिन्स्तास',
  'frothing_of_mouth/मुखबाट फोहोर निस्कनु',
  'frothing/फोहोर',
  'gaseous_stomach/पेटमा ग्यास',
  'highly_diarrhoea/गम्भीर दस्त',
  'high_pulse_rate/छिटो नाडी',
  'high_temp/उच्च ज्वरो',
  'high_proportion/उच्च अनुपात',
  'hyperaemia/अधिक रक्तसञ्चार',
  'hydrocephalus/पानी मस्तिष्क',
  'isolation_from_herd/झुण्डबाट अलग',
  'infertility/बाँझोपन',
  'intermittent_fever/अविराम ज्वरो',
  'jaundice/पीलिया',
  'ketosis/किटोसिस',
  'loss_of_appetite/भोक नलाग्नु',
  'lameness/लम्पसार',
  'lack_of-coordination/समन्वय कमी',
  'lethargy/सूनिनु',
  'lacrimation/आँसु बग्नु',
  'milk_flakes/दूधमा पातलो सतह',
  'milk_watery/पानीजस्तो दूध',
  'milk_clots/दूध जम्नु',
  'mild_diarrhoea/हल्का दस्त',
  'moaning/कराउनु',
  'mucosal_lesions/श्लेष्मा घाउ',
  'milk_fever/दूध ज्वरो',
  'nausea/वान्ता',
  'nasel_discharges/नाकबाट स्राव',
  'oedema/सूजन',
  'pain/दुखाइ',
  'painful_tongue/जिव्रो दुख्नु',
  'pneumonia/न्यूमोनिया',
  'photo_sensitization/प्रकाश प्रति संवेदनशीलता',
  'quivering_lips/हल्लिने ओठ',
  'reduction_milk_vields/दूध उत्पादन घट्नु',
  'rapid_breathing/छिटो सास फेर्नु',
  'rumenstasis/रुमेन स्थिरता',
  'reduced_rumination/कम चबाउनु',
  'reduced_fertility/प्रजनन क्षमता घट्नु',
  'reduced_fat/चिल्लो घट्नु',
  'reduces_feed_intake/खाद्यान्न कम खाने',
  'raised_breathing/बढेको सास',
  'stomach_pain/पेट दुख्नु',
  'salivation/थुक बग्नु',
  'stillbirths/मृत शिशु',
  'shallow_breathing/कम सास फेर्नु',
  'swollen_pharyngeal/सुन्निने गला सुन्निनु',
  'swelling/सुजन',
  'saliva/थुक',
  'swollen_tongue/जिव्रो सुन्निनु',
  'tachycardia/छिटो नाडी चल्नु',
  'torticollis/घाँटीको विकृति',
  'udder_swelling/स्तन सुन्निनु',
  'udder_heat/स्तन तातो हुनु',
  'udder_hardeness/स्तन कठोर हुनु',
  'udder_redness/स्तन रातो हुनु',
  'udder_pain/स्तन दुख्नु',
  'unwillingness_to_move/चल्न नचाहनु',
  'ulcers/घाउ',
  'vomiting/वान्ता',
  'weight_loss/तौल घट्नु',
  'weakness/कमजोरी',
];

const CattleDisease = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState({});
  const [diseaseInfo, setDiseaseInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (englishName) => {
    const currentlySelected = Object.values(selectedSymptoms).filter((val) => val === 1).length;

    if (!selectedSymptoms[englishName] && currentlySelected >= 3) {
      return; // disable further selection
    }

    setSelectedSymptoms((prev) => ({
      ...prev,
      [englishName]: prev[englishName] ? 0 : 1,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDiseaseInfo('');
    setErrorMsg('');

    const selected = Object.entries(selectedSymptoms).filter(([_, v]) => v === 1);
    if (selected.length !== 3) {
      setErrorMsg('Please select exactly 3 symptoms.');
      return;
    }

    alert("This is only a prediction. Please contact a veterinarian for confirmation.");
    const symptomsPayload = selected.reduce((acc, [k]) => ({ ...acc, [k]: 1 }), {});
    setLoading(true);

    try {
      const { data } = await axios.post('http://127.0.0.1:5001/predict', symptomsPayload);
      const predictedDisease = data.prediction;
console.log(predictedDisease);

      setDiseaseInfo(predictedDisease);
    } catch (error) {
      console.error('Prediction failed:', error);
      setErrorMsg('An error occurred while predicting. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const selectedCount = Object.values(selectedSymptoms).filter((v) => v === 1).length;

  return (
    <div className="p-4">
      <h2 className="text-red-600 font-bold text-center mb-4">
        ⚠️ यो केवल पूर्वानुमानको लागि हो। कृपया पशु चिकित्सकसँग तुरुन्त सम्पर्क गर्नुहोस्।
      </h2>

      <h3 className="font-semibold mb-2">लक्षणहरू छान्नुहोस् (अधिकतम ३)</h3>

      <div style={{ columns: 2 }} className="mb-4">
        {symptomsList.map((item) => {
          const [english, nepali] = item.split('/');
          const checked = selectedSymptoms[english] === 1;
          const disabled = !checked && selectedCount >= 3;

          return (
            <label key={english} className="block mb-1">
              <input
                type="checkbox"
                onChange={() => handleChange(english)}
                checked={checked}
                disabled={disabled}
                className="mr-2"
              />
              {english} / {nepali}
            </label>
          );
        })}
      </div>

      {errorMsg && <p className="text-red-500 text-center mb-2">{errorMsg}</p>}

      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-500 text-black rounded ring disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Predicting...' : 'Predict Cattle Diseases'}
        </button>
      </div>

      {diseaseInfo && (
        <div className="mt-6 p-4 border rounded bg-gray-100 whitespace-pre-wrap">
          <h4 className="font-bold mb-2">🧠 Disease Info:</h4>
        According to your selection we predict this diseases:= {diseaseInfo}
        </div>
      )}
    </div>
  );
};


export default CattleDisease;
