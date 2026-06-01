-- Seed data for the articles table
INSERT INTO public.articles (id, category, category_name, title, content, date, image_desc, image_gradient)
VALUES 
(
  'd86f7b1e-d4c3-4d43-a6fe-b7650f9dbde3',
  'ai-care',
  'AI 돌봄',
  'AI가 알려주는 낙상 예방법',
  '노년기 건강을 위협하는 가장 큰 요인 중 하나는 바로 ''낙상''입니다. 뼈가 약해진 상태에서의 넘어짐은 심각한 골절로 이어질 수 있으며, 회복 기간 동안의 근력 손실은 또 다른 건강 문제를 야기합니다. 하지만 최근 인공지능(AI)과 센서 기술의 발전으로 낙상을 사전에 예측하고 예방할 수 있는 새로운 길이 열리고 있습니다. 집안의 위험 요소를 AI 카메라로 분석하고, 실생활에서 쉽게 실천할 수 있는 낙상 예방 가이드를 제공합니다.',
  '2024년 10월 28일',
  '대표 이미지 (어두운 복도 속 AI 낙상 감지 센서 구동 화면)',
  'from-slate-900 via-slate-950 to-teal-950'
),
(
  'e57b982c-473d-4c3e-8120-f1c50e4bdfe4',
  'nutrition',
  '영양',
  '혈당 관리, 이렇게 하면 쉬워요',
  '식단 조절이 막막하신가요? 일상에서 실천할 수 있는 혈당 관리 식습관을 소개합니다. 나이가 들면서 혈당 관리는 선택이 아닌 필수가 됩니다. 하지만 너무 어렵게 생각할 필요는 없습니다. 일상 속 작은 습관 변화만으로도 큰 효과를 볼 수 있습니다. 정제 탄수화물 섭취를 줄이고, 식이섬유가 풍부한 채소류를 식사 첫 단계에 섭취해 보세요.',
  '2024년 10월 24일',
  '대표 이미지 (건강하고 신선한 현미 잡곡밥과 채소 밥상)',
  'from-emerald-950 via-teal-950 to-slate-950'
),
(
  'f98b1a3d-3d4c-4e8a-bf90-f2c90e4beff5',
  'blood-pressure',
  '혈압 관리',
  '아침 혈압이 높다면? 이것부터 확인하세요',
  '아침에 혈압이 갑자기 높아지는 이유와 생활 습관 개선 방법을 알려드립니다. 기상 직후 2시간 이내에 측정하는 혈압이 평소보다 지나치게 높다면 심뇌혈관 질환의 위험 신호일 수 있습니다. 따뜻한 물 한 잔과 함께 가벼운 스트레칭으로 하루를 시작하는 습관을 들여보세요. 수면 중 실내 온도 조절도 중요합니다.',
  '2024년 10월 20일',
  '대표 이미지 (아침 햇살이 비치는 침실과 혈압계)',
  'from-sky-950 via-slate-950 to-teal-950'
)
ON CONFLICT (id) DO UPDATE SET
  category = EXCLUDED.category,
  category_name = EXCLUDED.category_name,
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  date = EXCLUDED.date,
  image_desc = EXCLUDED.image_desc,
  image_gradient = EXCLUDED.image_gradient;
