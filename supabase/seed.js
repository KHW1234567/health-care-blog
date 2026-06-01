const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Helper to parse .env.local
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('Error: .env.local file not found!');
    process.exit(1);
  }

  const envFile = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envFile.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let key = match[1];
      let value = match[2] || '';
      // Remove double quotes or single quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      env[key] = value;
    }
  });
  return env;
}

async function seed() {
  console.log('Reading environment variables...');
  const env = loadEnv();
  
  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing in .env.local');
    process.exit(1);
  }

  console.log('Connecting to Supabase...');
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const initialArticles = [
    {
      id: 'd86f7b1e-d4c3-4d43-a6fe-b7650f9dbde3',
      category: 'ai-care',
      category_name: 'AI 돌봄',
      title: 'AI가 알려주는 낙상 예방법',
      content: '노년기 건강을 위협하는 가장 큰 요인 중 하나는 바로 \'낙상\'입니다. 뼈가 약해진 상태에서의 넘어짐은 심각한 골절로 이어질 수 있으며, 회복 기간 동안의 근력 손실은 또 다른 건강 문제를 야기합니다. 하지만 최근 인공지능(AI)과 센서 기술의 발전으로 낙상을 사전에 예측하고 예방할 수 있는 새로운 길이 열리고 있습니다. 집안의 위험 요소를 AI 카메라로 분석하고, 실생활에서 쉽게 실천할 수 있는 낙상 예방 가이드를 제공합니다.',
      date: '2024년 10월 28일',
      image_desc: '대표 이미지 (어두운 복도 속 AI 낙상 감지 센서 구동 화면)',
      image_gradient: 'from-slate-900 via-slate-950 to-teal-950'
    },
    {
      id: 'e57b982c-473d-4c3e-8120-f1c50e4bdfe4',
      category: 'nutrition',
      category_name: '영양',
      title: '혈당 관리, 이렇게 하면 쉬워요',
      content: '식단 조절이 막막하신가요? 일상에서 실천할 수 있는 혈당 관리 식습관을 소개합니다. 나이가 들면서 혈당 관리는 선택이 아닌 필수가 됩니다. 하지만 너무 어렵게 생각할 필요는 없습니다. 일상 속 작은 습관 변화만으로도 큰 효과를 볼 수 있습니다. 정제 탄수화물 섭취를 줄이고, 식이섬유가 풍부한 채소류를 식사 첫 단계에 섭취해 보세요.',
      date: '2024년 10월 24일',
      image_desc: '대표 이미지 (건강하고 신선한 현미 잡곡밥과 채소 밥상)',
      image_gradient: 'from-emerald-950 via-teal-950 to-slate-950'
    },
    {
      id: 'f98b1a3d-3d4c-4e8a-bf90-f2c90e4beff5',
      category: 'blood-pressure',
      category_name: '혈압 관리',
      title: '아침 혈압이 높다면? 이것부터 확인하세요',
      content: '아침에 혈압이 갑자기 높아지는 이유와 생활 습관 개선 방법을 알려드립니다. 기상 직후 2시간 이내에 측정하는 혈압이 평소보다 지나치게 높다면 심뇌혈관 질환의 위험 신호일 수 있습니다. 따뜻한 물 한 잔과 함께 가벼운 스트레칭으로 하루를 시작하는 습관을 들여보세요. 수면 중 실내 온도 조절도 중요합니다.',
      date: '2024년 10월 20일',
      image_desc: '대표 이미지 (아침 햇살이 비치는 침실과 혈압계)',
      image_gradient: 'from-sky-950 via-slate-950 to-teal-950'
    }
  ];

  console.log('Seeding initial articles...');
  
  // Try upserting articles. Since RLS is enabled, writes might fail if not authenticated
  // as the service role key or if RLS policies restrict it. We explain this in instructions.
  const { data, error } = await supabase
    .from('articles')
    .upsert(initialArticles, { onConflict: 'id' });

  if (error) {
    console.error('Seeding failed!');
    console.error('Error Details:', error.message);
    console.log('\n💡 Tip: If you get a permission error (New Row violates RLS), it is because RLS is active and anon inserts are blocked. To run the seed script locally, disable RLS temporarily or execute seed.sql inside the Supabase SQL Editor on the web dashboard (recommended!).');
  } else {
    console.log('Seeding completed successfully!');
  }
}

seed();
