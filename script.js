let generatedNumbers = [];
let winningNumbers = [];
let bonusNumber = null;

// 버튼 클릭 시 로또 번호 생성
function generateLottoNumbers() {
    const results = document.getElementById('results');
    results.innerHTML = '';  // 기존 결과 초기화
    generatedNumbers = [];  // 기존 생성된 번호 초기화

    for (let i = 0; i < 5; i++) {
        let numbers = [];
        while (numbers.length < 7) {  // 보너스 번호 포함 7개 숫자
            let randNum = getRandomNumberWithWeights();
            if (numbers.indexOf(randNum) === -1) {
                numbers.push(randNum);
            }
        }
        numbers.sort((a, b) => a - b);
        const bonus = numbers.pop();  // 마지막 숫자를 보너스 번호로

        generatedNumbers.push({ numbers, bonus });

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
        bonusCircle.className = `number-circle number-${getNumberRangeClass(bonus)} bonus`;
        bonusCircle.innerText = bonus;
        lottoDiv.appendChild(bonusCircle);

        results.appendChild(lottoDiv);
    }
}

// 버튼 클릭 시 당첨 번호를 외부 API에서 가져옴
function fetchWinningNumbers() {
    // 한국 로또 API URL
    const apiUrl = 'https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=';

    // 최신 회차 번호를 가져오는 API (예를 들어 1회차부터 시작)
    const latestDrawNumber = 1000; // 실제 최신 회차 번호로 교체 필요
    fetch(`${apiUrl}${latestDrawNumber}`)
        .then(response => response.json())
        .then(data => {
            if (data.returnValue === 'fail') {
                throw new Error('API 호출 실패');
            }
            winningNumbers = [
                data.drwtNo1,
                data.drwtNo2,
                data.drwtNo3,
                data.drwtNo4,
                data.drwtNo5,
                data.drwtNo6
            ];
            bonusNumber = data.bnusNo;
            console.log(`당첨 번호: ${winningNumbers}, 보너스 번호: ${bonusNumber}`);
        })
        .catch(error => console.error('당첨 번호를 가져오는 데 오류가 발생했습니다.', error));
}

// 버튼 클릭 시 로또 결과와 당첨 번호를 비교
function checkLottoResults() {
    const results = document.getElementById('results');
    if (winningNumbers.length === 0 || bonusNumber === null) {
        results.innerHTML = '먼저 당첨 번호를 가져오세요.';
        return;
    }

    results.innerHTML = '';  // 기존 결과 초기화

    generatedNumbers.forEach((draw, index) => {
        const { numbers, bonus } = draw;

        // 당첨 여부 확인
        const matches = numbers.filter(num => winningNumbers.includes(num)).length;
        const isBonusMatch = bonus === bonusNumber;

        // 결과를 새로운 div에 추가
        const lottoDiv = document.createElement('div');
        lottoDiv.className = 'lottoNumbers';
        
        numbers.forEach(num => {
            const numberCircle = document.createElement('div');
            numberCircle.className = `number-circle number-${getNumberRangeClass(num)}`;
            if (winningNumbers.includes(num)) {
                numberCircle.classList.add('winning');
            }
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
        bonusCircle.className = `number-circle number-${getNumberRangeClass(bonus)} bonus`;
        if (isBonusMatch) {
            bonusCircle.classList.add('winning');
        }
        bonusCircle.innerText = bonus;
        lottoDiv.appendChild(bonusCircle);

        // 당첨 메시지 추가
        const matchMessage = document.createElement('div');
        matchMessage.className = 'match-message';
        matchMessage.innerText = `회차 ${index + 1}: 맞은 번호: ${matches}개${isBonusMatch ? ' + 보너스 번호' : ''}`;
        lottoDiv.appendChild(matchMessage);

        results.appendChild(lottoDiv);
    });
}

// 가중치에 따라 랜덤 번호 생성
function getRandomNumberWithWeights() {
    const ranges = [
        { min: 1, max: 10, weight: 0.216 },
        { min: 11, max: 20, weight: 0.233 },
        { min: 21, max: 30, weight: 0.213 },
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

// 번호 범위에 따른 클래스 반환
function getNumberRangeClass(num) {
    if (num >= 1 && num <= 10) return '1-10';
    if (num >= 11 && num <= 20) return '11-20';
    if (num >= 21 && num <= 30) return '21-30';
    if (num >= 31 && num <= 40) return '31-40';
    if (num >= 41 && num <= 45) return '41-45';
}
