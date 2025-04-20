document.addEventListener('DOMContentLoaded', function() {
    // 初始化ECharts
    if (typeof echarts === 'undefined') {
        console.error('ECharts未加载成功');
        return;
    }

    // 绑定生成按钮事件
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generateRadar);
    } else {
        console.error('找不到生成按钮');
    }
});

function generateRadar() {
    console.log('开始生成测评报告...');
    
    try {
        // 1. 收集表单数据
        const formData = collectFormData();
        
        // 2. 验证数据
        if (!validateFormData(formData)) {
            return;
        }
        
        // 3. 准备弹窗内容
        prepareDialogContent(formData);
        
        // 4. 渲染雷达图
        renderRadarChart(formData);
        
        // 5. 显示弹窗
        document.getElementById('radarDialog').showModal();
        
    } catch (error) {
        console.error('生成报告时出错:', error);
        alert('生成报告时出错，请检查控制台日志');
    }
}

function collectFormData() {
    return {
        name: document.getElementById('name').value.trim(),
        gender: document.getElementById('gender').value,
        age: parseInt(document.getElementById('age').value),
        enunciation: parseInt(document.getElementById('enunciation').value),
        rhythm: parseInt(document.getElementById('rhythm').value),
        expression: parseInt(document.getElementById('expression').value),
        emotion: parseInt(document.getElementById('emotion').value),
        sound: parseInt(document.getElementById('sound').value),
        impromptu: parseInt(document.getElementById('impromptu').value),
        confidence: parseInt(document.getElementById('confidence').value),
        logic: parseInt(document.getElementById('logic').value),
        creativity: parseInt(document.getElementById('creativity').value),
        voice: parseInt(document.getElementById('voice').value),
        communication: parseInt(document.getElementById('communication').value),
        comment: document.getElementById('comment').value.trim()
    };
}

function validateFormData(data) {
    // 验证姓名
    if (!data.name) {
        alert('请输入姓名');
        document.getElementById('name').focus();
        return false;
    }

    // 验证年龄
    if (isNaN(data.age) || data.age < 3 || data.age > 99) {
        alert('请输入3-99之间的有效年龄');
        document.getElementById('age').focus();
        return false;
    }

    // 验证五维能力分数
    const dimensions = [
        { name: '自信力', value: data.confidence },
        { name: '逻辑力', value: data.logic },
        { name: '创造力', value: data.creativity },
        { name: '语音发声', value: data.voice },
        { name: '人际沟通力', value: data.communication }
    ];

    for (const dim of dimensions) {
        if (isNaN(dim.value) || dim.value < 0 || dim.value > 100) {
            alert(`请为${dim.name}输入0-100之间的有效分数`);
            return false;
        }
    }

    return true;
}

function prepareDialogContent(data) {
    // 设置标题和基本信息
    document.getElementById('dialogTitle').textContent = `${data.name}的语言口才能力测评报告`;
    document.getElementById('displayGender').textContent = data.gender;
    document.getElementById('displayAge').textContent = data.age;
    
    // 设置评语
    document.getElementById('comment-text').textContent = 
        data.comment || "（老师未填写评语）";
    
    // 设置测评时间
    const now = new Date();
    const timeString = now.toLocaleString('zh-CN');
    document.getElementById('evaluationTime').textContent = `测评时间：${timeString}`;
    
    // 渲染星星评分
    renderStarRatings([
        { name: '吐字', value: data.enunciation },
        { name: '节奏', value: data.rhythm },
        { name: '表达', value: data.expression },
        { name: '情感', value: data.emotion },
        { name: '声音', value: data.sound },
        { name: '即兴', value: data.impromptu }
    ]);
}

function renderStarRatings(ratings) {
    const container = document.querySelector('.star-ratings');
    container.innerHTML = '';
    
    const starTextMap = {
        1: '需加强',
        2: '一般',
        3: '良好',
        4: '优秀',
        5: '卓越'
    };
    
    ratings.forEach(item => {
        const ratingEl = document.createElement('div');
        ratingEl.className = 'star-rating';
        
        const nameEl = document.createElement('span');
        nameEl.className = 'rating-name';
        nameEl.textContent = item.name;
        
        const starsEl = document.createElement('div');
        starsEl.className = 'stars';
        
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.className = 'star';
            star.innerHTML = i <= item.value ? '★' : '☆';
            starsEl.appendChild(star);
        }
        
        const textEl = document.createElement('span');
        textEl.className = 'rating-text';
        textEl.textContent = starTextMap[item.value] || '';
        
        ratingEl.appendChild(nameEl);
        ratingEl.appendChild(starsEl);
        ratingEl.appendChild(textEl);
        container.appendChild(ratingEl);
    });
}

function renderRadarChart(data) {
    const chartDom = document.getElementById('radarChart');
    const myChart = echarts.init(chartDom);
    
    const option = {
        radar: {
            indicator: [
                { name: '自信力', max: 100 },
                { name: '逻辑力', max: 100 },
                { name: '创造力', max: 100 },
                { name: '语音发声', max: 100 },
                { name: '人际沟通力', max: 100 }
            ],
            radius: '65%',
            splitNumber: 4,
            axisName: {
                color: '#333'
            },
            splitArea: {
                areaStyle: {
                    color: ['rgba(52, 152, 219, 0.1)']
                }
            }
        },
        series: [{
            type: 'radar',
            data: [{
                value: [
                    data.confidence,
                    data.logic,
                    data.creativity,
                    data.voice,
                    data.communication
                ],
                name: '能力评估',
                areaStyle: {
                    color: 'rgba(52, 152, 219, 0.4)'
                },
                lineStyle: {
                    color: 'rgba(52, 152, 219, 0.8)'
                },
                symbolSize: 8,
                label: {
                    show: true,
                    formatter: function(params) {
                        return params.value;
                    }
                }
            }]
        }]
    };
    
    myChart.setOption(option);
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

function closeDialog() {
    document.getElementById('radarDialog').close();
}
