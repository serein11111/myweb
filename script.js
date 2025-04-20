function generateRadar() {
    const name = document.getElementById('name').value;
    const gender = document.getElementById('gender').value;
    const age = document.getElementById('age').value;
    const enunciation = parseInt(document.getElementById('enunciation').value);
    const rhythm = parseInt(document.getElementById('rhythm').value);
    const expression = parseInt(document.getElementById('expression').value);
    const emotion = parseInt(document.getElementById('emotion').value);
    const sound = parseInt(document.getElementById('sound').value);
    const impromptu = parseInt(document.getElementById('impromptu').value);
    const confidence = parseFloat(document.getElementById('confidence').value);
    const logic = parseFloat(document.getElementById('logic').value);
    const creativity = parseFloat(document.getElementById('creativity').value);
    const voice = parseFloat(document.getElementById('voice').value);
    const communication = parseFloat(document.getElementById('communication').value);
    const comment = document.getElementById('comment').value;

    const inputIds = ['confidence', 'logic', 'creativity', 'voice', 'communication'];
    const values = [confidence, logic, creativity, voice, communication];

    for (let i = 0; i < values.length; i++) {
        if (isNaN(values[i]) || values[i] < 0 || values[i] > 100) {
            alert(`请输入 0 - 100 之间的有效成绩！`);
            document.getElementById(inputIds[i]).focus();
            return;
        }
    }

    const myChart = echarts.init(document.getElementById('radarChart'));

    const option = {
        radar: {
            indicator: [
                { name: '自信力', max: 100 },
                { name: '逻辑力', max: 100 },
                { name: '人际沟通力', max: 100 },
                { name: '语音发声', max: 100 },
                { name: '创造力', max: 100 }
            ],
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 153, 51, 0.3)'
                }
            }
        },
        series: [{
            type: 'radar',
            data: [{
                value: values,
                name: '能力数据',
                label: {
                    show: true,
                    formatter: function (params) {
                        return params.value;
                    }
                },
                areaStyle: {
                    color: 'rgba(255, 153, 51, 0.3)'
                },
                lineStyle: {
                    color: '#FF9933'
                },
                symbol: 'circle',
                symbolSize: 8,
                itemStyle: {
                    color: '#FF9933'
                }
            }]
        }]
    };

    myChart.setOption(option);

    // 设置弹窗标题和基本信息
    const dialogTitle = document.getElementById('dialogTitle');
    dialogTitle.textContent = `${name} 语言口才能力测评`;
    document.getElementById('displayGender').textContent = gender;
    document.getElementById('displayAge').textContent = age;

    // 显示语言基本能力测评星星
    setStars('enunciation-stars', enunciation);
    setStars('rhythm-stars', rhythm);
    setStars('expression-stars', expression);
    setStars('emotion-stars', emotion);
    setStars('sound-stars', sound);
    setStars('impromptu-stars', impromptu);

    // 显示测评老师评价寄语
    const commentText = document.getElementById('comment-text');
    commentText.textContent = `测评老师评价寄语：${comment}`;

    // 获取当前时间并格式化
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    // 设置测评时间
    const evaluationTimeElement = document.getElementById('evaluationTime');
    evaluationTimeElement.textContent = `测评时间：${formattedTime}`;

    // 打开弹窗
    const dialog = document.getElementById('radarDialog');
    dialog.showModal();
}

function setStars(starGroupId, starCount) {
    const starGroup = document.getElementById(starGroupId);
    starGroup.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.classList.add('star');
        if (i <= starCount) {
            star.classList.add('star-filled');
        }
        starGroup.appendChild(star);
    }

    // 根据星星数量显示对应的文字评价
    const starTextMap = {
        1: '继续加油',
        2: '表现较好',
        3: '比较优秀',
        4: '表现很棒',
        5: '超出预期'
    };
    const starTextElement = starGroup.nextElementSibling;
    starTextElement.textContent = starTextMap[starCount];
}

function closeDialog() {
    const dialog = document.getElementById('radarDialog');
    dialog.close();
}
