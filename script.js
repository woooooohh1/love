function generateLottoNumbers() {
    const results = document.getElementById('results');
    results.innerHTML = '';  // 기존 결과 초기화

    for (let i = 0; i < 5; i++) {
        let numbers = [];
        while (numbers.length < 7) {  // 보너스 번호 포함 7개 숫자
            let randNum = getRandomNumberWithWeights();
            if (numbers.indexOf(randNum) === -1) {
                numbers.push(randNum);
            }
        }
        numbers.sort((a, b) => a - b);
        const bonusNumber = numbers.pop();  // 마지막 숫자를 보너스 번호로

        // 결과를 새로운 div에 추가
        const lottoDiv = document.createElement('div');
        lottoDiv.className = 'lottoNumbers';
        
        numbers.forEach(num => {
            const numberCircle = document.createElement('div');
            numberCircle.className = `number-circle number-${getNumberRangeClass(num)}`;
            numberCircle.innerText = num;
            lottoDiv.appendChild(numberCircle);
        });

        // + 문자 추가
        const plusSign = document.createElement('div');
        plusSign.className = 'plus-sign';
        plusSign.innerText = '+';
        lottoDiv.appendChild(plusSign);

        // 보너스 번호 추가
        const bonusCircle = document.createElement('div');
        bonusCircle.className = `number-circle number-${getNumberRangeClass(bonusNumber)} bonus`;
        bonusCircle.innerText = bonusNumber;
        lottoDiv.appendChild(bonusCircle);

        results.appendChild(lottoDiv);
    }
}

function getRandomNumberWithWeights() {
    const ranges = [
        { min: 1, max: 10, weight: 0.215 },
        { min: 11, max: 20, weight: 0.233 },
        { min: 21, max: 30, weight: 0.214 },
        { min: 31, max: 40, weight: 0.227 },
        { min: 41, max: 45, weight: 0.111 },
    ];

    const totalWeight = ranges.reduce((acc, range) => acc + range.weight, 0);
    const random = Math.random() * totalWeight;
    let currentWeight = 0;

    for (let range of ranges) {
        currentWeight += range.weight;
        if (random <= currentWeight) {
            return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        }
    }
}

function getNumberRangeClass(num) {
    if (num >= 1 && num <= 10) return '1-10';
    if (num >= 11 && num <= 20) return '11-20';
    if (num >= 21 && num <= 30) return '21-30';
    if (num >= 31 && num <= 40) return '31-40';
    if (num >= 41 && num <= 45) return '41-45';
}
