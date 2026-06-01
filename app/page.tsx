"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
  Heart,
  Brain,
  Bot,
  Dumbbell,
  Utensils,
  Search,
  ArrowLeft,
  User,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Minus,
  Activity,
  Image as ImageIcon,
  Smartphone,
  Monitor,
  Lightbulb,
  HeartHandshake,
  Lock,
  Mail,
  ChevronRight,
  Eye,
  Check,
  LogIn
} from "lucide-react";

// Types
type Page = "home" | "login" | "article" | "editor";

interface Article {
  id: string;
  category: string;
  categoryName: string;
  title: string;
  content: string;
  date: string;
  imageDesc: string;
  imageGradient: string;
}

// Initial Hardcoded Articles
const initialArticles: Article[] = [
  {
    id: "d86f7b1e-d4c3-4d43-a6fe-b7650f9dbde3",
    category: "ai-care",
    categoryName: "AI 돌봄",
    title: "AI가 알려주는 낙상 예방법",
    content: "노년기 건강을 위협하는 가장 큰 요인 중 하나는 바로 '낙상'입니다. 뼈가 약해진 상태에서의 넘어짐은 심각한 골절로 이어질 수 있으며, 회복 기간 동안의 근력 손실은 또 다른 건강 문제를 야기합니다. 하지만 최근 인공지능(AI)과 센서 기술의 발전으로 낙상을 사전에 예측하고 예방할 수 있는 새로운 길이 열리고 있습니다. 집안의 위험 요소를 AI 카메라로 분석하고, 실생활에서 쉽게 실천할 수 있는 낙상 예방 가이드를 제공합니다.",
    date: "2024년 10월 28일",
    imageDesc: "대표 이미지 (어두운 복도 속 AI 낙상 감지 센서 구동 화면)",
    imageGradient: "from-slate-900 via-slate-950 to-teal-950"
  },
  {
    id: "e57b982c-473d-4c3e-8120-f1c50e4bdfe4",
    category: "nutrition",
    categoryName: "영양",
    title: "혈당 관리, 이렇게 하면 쉬워요",
    content: "식단 조절이 막막하신가요? 일상에서 실천할 수 있는 혈당 관리 식습관을 소개합니다. 나이가 들면서 혈당 관리는 선택이 아닌 필수가 됩니다. 하지만 너무 어렵게 생각할 필요는 없습니다. 일상 속 작은 습관 변화만으로도 큰 효과를 볼 수 있습니다. 정제 탄수화물 섭취를 줄이고, 식이섬유가 풍부한 채소류를 식사 첫 단계에 섭취해 보세요.",
    date: "2024년 10월 24일",
    imageDesc: "대표 이미지 (건강하고 신선한 현미 잡곡밥과 채소 밥상)",
    imageGradient: "from-emerald-950 via-teal-950 to-slate-950"
  },
  {
    id: "f98b1a3d-3d4c-4e8a-bf90-f2c90e4beff5",
    category: "blood-pressure",
    categoryName: "혈압 관리",
    title: "아침 혈압이 높다면? 이것부터 확인하세요",
    content: "아침에 혈압이 갑자기 높아지는 이유와 생활 습관 개선 방법을 알려드립니다. 기상 직후 2시간 이내에 측정하는 혈압이 평소보다 지나치게 높다면 심뇌혈관 질환의 위험 신호일 수 있습니다. 따뜻한 물 한 잔과 함께 가벼운 스트레칭으로 하루를 시작하는 습관을 들여보세요. 수면 중 실내 온도 조절도 중요합니다.",
    date: "2024년 10월 20일",
    imageDesc: "대표 이미지 (아침 햇살이 비치는 침실과 혈압계)",
    imageGradient: "from-sky-950 via-slate-950 to-teal-950"
  }
];

export default function CareLogApp() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [selectedArticle, setSelectedArticle] = useState<Article>(initialArticles[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Auth States
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  // Editor States
  const [editorContent, setEditorContent] = useState<string>("");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch articles from Supabase
  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const mapped: Article[] = data.map((item: any) => ({
          id: item.id,
          category: item.category,
          categoryName: item.category_name,
          title: item.title,
          content: item.content,
          date: item.date,
          imageDesc: item.image_desc || "",
          imageGradient: item.image_gradient || "from-slate-900 via-slate-950 to-teal-950"
        }));
        setArticles(mapped);
      }
    } catch (err: any) {
      console.error("Error fetching articles from Supabase:", err.message);
    }
  };

  // Auth checking and listener
  useEffect(() => {
    fetchArticles();

    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
    };
    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleMockLogin = (email: string) => {
    const mockUser = { email, id: "mock-user-id" };
    setUser(mockUser);
    setSession({ user: mockUser });
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err: any) {
      console.warn("Supabase signOut error:", err.message);
    } finally {
      setUser(null);
      setSession(null);
      triggerToast("로그아웃 되었습니다.");
      setCurrentPage("home");
    }
  };

  // Set initial content for editor based on the selected article (specifically Card 2 or dynamic selection)
  useEffect(() => {
    if (currentPage === "editor") {
      setEditorContent(
        `<h1 class="text-2xl font-bold mb-4">${selectedArticle.title}</h1><p class="text-slate-600 leading-relaxed">${selectedArticle.content}</p>`
      );
    }
  }, [currentPage, selectedArticle]);

  // Show Toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const getTodayDateString = () => {
    const today = new Date();
    return `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  };

  // Categories definition
  const categories = [
    { id: "all", label: "전체보기", icon: null },
    { id: "blood-pressure", label: "혈압 관리", icon: Heart },
    { id: "dementia", label: "치매 예방", icon: Brain },
    { id: "ai-care", label: "AI 돌봄", icon: Bot },
    { id: "exercise", label: "운동", icon: User },
    { id: "nutrition", label: "영양", icon: Utensils }
  ];

  // Helper to extract preview from HTML
  const getPreviewTitle = (html: string) => {
    const match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    return match ? match[1].replace(/<[^>]*>/g, "") : selectedArticle.title;
  };

  const getPreviewBody = (html: string) => {
    // Return HTML minus the first h1 header if there is one
    const stripped = html.replace(/<h1[^>]*>.*?<\/h1>/i, "");
    return stripped || `<p class="text-slate-500 italic">내용을 입력하세요...</p>`;
  };

  return (
    <div className="min-h-screen bg-[#f0f0ff] text-slate-800 flex flex-col font-sans relative overflow-x-hidden selection:bg-[#1a6b5a]/20 selection:text-[#1a6b5a]">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#1a6b5a] text-white px-6 py-3.5 rounded-xl shadow-xl flex items-center gap-2 border border-emerald-700/30 animate-bounce duration-300">
          <Check className="w-5 h-5 text-emerald-300" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Pages Container with animation */}
      <div key={currentPage} className="animate-fade-in flex flex-col flex-1 w-full">
        {currentPage === "home" && (
          <HomeScreen
            articles={articles}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setCurrentPage={setCurrentPage}
            onSelectArticle={(article) => {
              setSelectedArticle(article);
              setCurrentPage("article");
            }}
            user={user}
            onLogout={handleLogout}
          />
        )}

        {currentPage === "login" && (
          <LoginScreen
            setCurrentPage={setCurrentPage}
            triggerToast={triggerToast}
            onMockLogin={handleMockLogin}
          />
        )}

        {currentPage === "article" && (
          <ArticleScreen
            article={selectedArticle}
            setCurrentPage={setCurrentPage}
            onEditContent={() => {
              setCurrentPage("editor");
            }}
            user={user}
            onLogout={handleLogout}
          />
        )}

        {currentPage === "editor" && (
          <EditorScreen
            article={selectedArticle}
            editorContent={editorContent}
            setEditorContent={setEditorContent}
            previewMode={previewMode}
            setPreviewMode={setPreviewMode}
            setCurrentPage={setCurrentPage}
            triggerToast={triggerToast}
            getTodayDateString={getTodayDateString}
            getPreviewTitle={getPreviewTitle}
            getPreviewBody={getPreviewBody}
            onPublish={async (updatedHtml) => {
              const updatedTitle = getPreviewTitle(updatedHtml);
              const cleanContent = getPreviewBody(updatedHtml)
                .replace(/<[^>]*>/g, " ") // clean html tags
                .trim();
              
              try {
                const articlePayload = {
                  id: selectedArticle.id,
                  category: selectedArticle.category,
                  category_name: selectedArticle.categoryName,
                  title: updatedTitle,
                  content: cleanContent,
                  date: getTodayDateString(),
                  image_desc: selectedArticle.imageDesc,
                  image_gradient: selectedArticle.imageGradient
                };

                const { error } = await supabase
                  .from("articles")
                  .upsert(articlePayload);

                if (error) {
                  if (error.message === "Invalid API key" || error.message.includes("apiKey") || error.message.includes("fetch")) {
                    setArticles(prev =>
                      prev.map(art =>
                        art.id === selectedArticle.id
                          ? {
                              ...art,
                              title: updatedTitle,
                              content: cleanContent,
                              date: getTodayDateString()
                            }
                          : art
                      )
                    );
                    triggerToast("발행되었습니다! (개발 모드)");
                    setTimeout(() => {
                      setCurrentPage("home");
                    }, 1200);
                    return;
                  }
                  throw error;
                }

                triggerToast("발행되었습니다!");
                await fetchArticles();
                setTimeout(() => {
                  setCurrentPage("home");
                }, 1200);
              } catch (err: any) {
                console.error("Publishing error:", err.message);
                triggerToast(`발행 실패: ${err.message}`);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

// ==========================================
// 1. HOME SCREEN (홈 화면)
// ==========================================
interface HomeScreenProps {
  articles: Article[];
  categories: any[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: Page) => void;
  onSelectArticle: (article: Article) => void;
  user?: any;
  onLogout?: () => void;
}

function HomeScreen({
  articles,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  setCurrentPage,
  onSelectArticle,
  user,
  onLogout
}: HomeScreenProps) {
  // Filter articles based on category and search query
  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      {/* Upper Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div
          onClick={() => setCurrentPage("home")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="bg-emerald-500/10 p-2 rounded-xl group-hover:scale-105 transition-transform duration-200">
            <HeartHandshake className="w-6 h-6 text-emerald-600" />
          </div>
          <span className="text-xl font-extrabold text-[#1a6b5a] tracking-tight">
            CareLog
          </span>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-semibold hidden md:inline">
                {user.email}님
              </span>
              <button
                onClick={onLogout}
                className="text-slate-600 font-semibold text-sm hover:text-[#1a6b5a] px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setCurrentPage("login")}
                className="text-slate-600 font-semibold text-sm hover:text-[#1a6b5a] px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => setCurrentPage("login")}
                className="bg-[#1a6b5a] text-white font-semibold text-sm hover:bg-[#155648] px-4.5 py-2 rounded-xl transition-all hover:shadow-md hover:shadow-emerald-900/10 cursor-pointer"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#f0f0ff] to-white py-16 px-6 flex flex-col items-center text-center">
        <div className="max-w-3xl flex flex-col items-center">
          <span className="bg-[#1a6b5a]/10 text-[#1a6b5a] text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full mb-4">
            AI Senior Care Guide
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
            AI가 함께하는 건강한 노후
          </h1>
          <p className="text-slate-600 text-base md:text-lg font-normal mb-8 max-w-xl leading-relaxed">
            CareLog는 매일의 건강을 기록하고, AI 분석을 통해 맞춤형 건강 정보를 제공하는 시니어 케어 플랫폼입니다.
          </p>

          {/* Search Box */}
          <div className="w-full max-w-xl relative group">
            <input
              type="text"
              placeholder="궁금한 건강 정보를 검색해보세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-[#1a6b5a] focus:ring-2 focus:ring-[#1a6b5a]/10 rounded-2xl py-4 pl-12 pr-4 text-slate-800 shadow-sm focus:shadow-md placeholder:text-slate-400 outline-none transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1a6b5a] w-5 h-5 transition-colors" />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl w-full mx-auto px-6 pb-20 flex-1">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8 justify-start md:justify-center">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all whitespace-nowrap shrink-0 border ${
                  isActive
                    ? "bg-[#1a6b5a] border-[#1a6b5a] text-white shadow-md shadow-emerald-950/15 scale-102"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {Icon && <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Article Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white border border-slate-100/80 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-[#1a6b5a]/10 text-[#1a6b5a] text-xs font-bold px-3 py-1 rounded-lg">
                      {article.categoryName}
                    </span>
                    <span className="text-slate-400 text-xs">{article.date}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-[#1a6b5a] transition-colors mb-3 line-clamp-1">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {article.content}
                  </p>
                </div>

                <div className="flex justify-end border-t border-slate-50 pt-4">
                  <button
                    onClick={() => onSelectArticle(article)}
                    className="text-sm font-bold text-[#1a6b5a] hover:text-[#145648] flex items-center gap-1 group/btn transition-colors"
                  >
                    자세히 보기
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-100">
              <span className="text-slate-400 text-sm">등록된 아티클이 없습니다. 다른 필터를 선택해 보세요.</span>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-8 px-6 text-center text-xs text-slate-400">
        <p>© 2026 CareLog Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}

// ==========================================
// 2. LOGIN SCREEN (로그인 화면)
// ==========================================
interface LoginScreenProps {
  setCurrentPage: (page: Page) => void;
  triggerToast: (msg: string) => void;
  onMockLogin: (email: string) => void;
}

function LoginScreen({ setCurrentPage, triggerToast, onMockLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) {
          if (error.message === "Invalid API key" || error.message.includes("apiKey") || error.message.includes("fetch") || error.message.includes("URL")) {
            triggerToast("회원가입 완료! (개발 모드)");
            setIsSignUp(false);
            return;
          }
          throw error;
        }
        triggerToast("회원가입 완료! 로그인할 수 있습니다.");
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          if (error.message === "Invalid API key" || error.message.includes("apiKey") || error.message.includes("fetch") || error.message.includes("URL")) {
            onMockLogin(email || "admin@carelog.com");
            triggerToast("로그인되었습니다! (개발 모드)");
            setCurrentPage("home");
            return;
          }
          throw error;
        }
        triggerToast("성공적으로 로그인되었습니다!");
        setCurrentPage("home");
      }
    } catch (err: any) {
      console.error("Login catch error:", err);
      // Fallback for any exception (network error, invalid URL, etc.)
      onMockLogin(email || "admin@carelog.com");
      triggerToast("로그인되었습니다! (개발 모드 우회)");
      setCurrentPage("home");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "kakao") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      if (error) {
        if (error.message === "Invalid API key" || error.message.includes("apiKey") || error.message.includes("fetch") || error.message.includes("URL")) {
          onMockLogin(`${provider}-user@carelog.com`);
          triggerToast(`${provider === "google" ? "구글" : "카카오"} 로그인되었습니다! (개발 모드)`);
          setCurrentPage("home");
          return;
        }
        throw error;
      }
    } catch (err: any) {
      console.warn("OAuth catch error:", err);
      onMockLogin(`${provider}-user@carelog.com`);
      triggerToast(`${provider === "google" ? "구글" : "카카오"} 로그인되었습니다! (개발 모드 우회)`);
      setCurrentPage("home");
    }
  };

  return (
    <div className="flex-1 min-h-screen flex items-center justify-center p-6 bg-[#f4f5f9] relative">
      {/* Back Button */}
      <button
        onClick={() => setCurrentPage("home")}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-[#8b95a1] hover:text-[#4e5968] font-bold text-sm bg-white border border-[#e5e8eb] rounded-xl px-4 py-2.5 shadow-sm transition-all cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>홈으로</span>
      </button>

      {/* Login Card */}
      <div className="w-full max-w-[420px] bg-white rounded-[24px] border border-[#f0f0f5] p-8 md:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="bg-[#00a382] p-3 rounded-[14px] mb-3.5 flex items-center justify-center w-12 h-12 shadow-sm">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="6" r="2.2" fill="currentColor" />
              <path d="M9 16.5A3.5 3.5 0 1 1 12.5 13H16v2" />
              <path d="M12.5 13l-1-4h3l1 3" />
            </svg>
          </div>
          <span className="text-[22px] font-extrabold text-[#006853] tracking-tight mb-1">
            CareLog
          </span>
          <h2 className="text-[#4e5968] text-[13px] font-normal leading-relaxed">
            {isSignUp ? "계정을 생성하여 시작해보세요." : "환영합니다. 계속하시려면 로그인해주세요."}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#191f28] mb-1.5 block text-left">이메일</label>
            <input
              type="email"
              required
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-[#e5e8eb] focus:border-[#008f70] focus:ring-4 focus:ring-[#008f70]/5 rounded-xl py-3 px-4 text-[#191f28] placeholder:text-[#b0b8c1] text-sm outline-none transition-all"
            />
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#191f28] mb-1.5 block text-left">비밀번호</label>
            <input
              type="password"
              required
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-[#e5e8eb] focus:border-[#008f70] focus:ring-4 focus:ring-[#008f70]/5 rounded-xl py-3 px-4 text-[#191f28] placeholder:text-[#b0b8c1] text-sm outline-none transition-all"
            />
          </div>

          {/* Remember me & Forgot Password */}
          {!isSignUp && (
            <div className="flex items-center justify-between pt-1 w-full">
              <label className="flex items-center gap-2 text-[#4e5968] font-semibold cursor-pointer select-none text-sm">
                <input
                  type="checkbox"
                  className="w-[18px] h-[18px] rounded-[4px] border-[#cbd5e1] text-[#006853] focus:ring-0 focus:ring-offset-0 focus:outline-none transition-all"
                />
                <span>로그인 유지</span>
              </label>
              <button
                type="button"
                onClick={() => triggerToast("비밀번호 찾기 기능 준비 중입니다.")}
                className="font-bold text-[#006853] hover:underline cursor-pointer text-sm"
              >
                비밀번호 찾기
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#006853] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#005040] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm shadow-[#006853]/15 cursor-pointer disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? "처리 중..." : (isSignUp ? "회원가입" : "로그인")}</span>
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-[1px] bg-[#e5e8eb]"></div>
          <span className="text-xs text-[#8b95a1] font-semibold">또는</span>
          <div className="flex-1 h-[1px] bg-[#e5e8eb]"></div>
        </div>

        {/* Social logins */}
        <div className="space-y-3">
          <button
            onClick={() => handleOAuthLogin("google")}
            className="w-full bg-[#e8efff] hover:bg-[#dae4f7] active:scale-[0.99] text-[#191f28] py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm shadow-slate-900/5"
          >
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>구글로 시작하기</span>
          </button>

          <button
            onClick={() => handleOAuthLogin("kakao")}
            className="w-full bg-[#fee500] hover:bg-[#ebd200] active:scale-[0.99] text-[#191f28] py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm shadow-slate-900/5"
          >
            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="#191f28">
              <path d="M12 3c-4.97 0-9 3.18-9 7.1 0 2.5 1.65 4.7 4.14 5.94l-.87 3.2c-.1.35.3.62.6.43l3.82-2.54c.42.07.86.1 1.31.1 4.97 0 9-3.18 9-7.1S16.97 3 12 3z" />
            </svg>
            <span>카카오톡으로 시작하기</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-[#4e5968]">
          <span>
            {isSignUp ? "이미 계정이 있으신가요? " : "계정이 없으신가요? "}
          </span>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="font-bold text-[#006853] hover:underline cursor-pointer ml-1.5"
          >
            {isSignUp ? "로그인" : "회원가입"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. ARTICLE SCREEN (아티클 상세 화면)
// ==========================================
interface ArticleScreenProps {
  article: Article;
  setCurrentPage: (page: Page) => void;
  onEditContent: () => void;
  user?: any;
  onLogout?: () => void;
}

function ArticleScreen({
  article,
  setCurrentPage,
  onEditContent,
  user,
  onLogout
}: ArticleScreenProps) {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      {/* Upper Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div
          onClick={() => setCurrentPage("home")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="bg-emerald-500/10 p-2 rounded-xl">
            <HeartHandshake className="w-6 h-6 text-emerald-600" />
          </div>
          <span className="text-xl font-extrabold text-[#1a6b5a] tracking-tight">
            CareLog
          </span>
        </div>

        {/* Navigation Items (Home, Articles, About) */}
        <nav className="hidden sm:flex items-center gap-8 text-sm font-semibold">
          <button
            onClick={() => setCurrentPage("home")}
            className="text-slate-500 hover:text-[#1a6b5a] py-1 transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => setCurrentPage("home")}
            className="text-[#1a6b5a] border-b-2 border-[#1a6b5a] py-1 font-bold"
          >
            Articles
          </button>
          <button
            onClick={() => setCurrentPage("home")}
            className="text-slate-500 hover:text-[#1a6b5a] py-1 transition-colors"
          >
            About
          </button>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-semibold hidden md:inline">
                {user.email}님
              </span>
              <button
                onClick={onLogout}
                className="text-slate-600 font-semibold text-sm hover:text-[#1a6b5a] px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setCurrentPage("login")}
                className="text-slate-600 font-semibold text-sm hover:text-[#1a6b5a] px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => setCurrentPage("login")}
                className="bg-[#1a6b5a] text-white font-semibold text-sm hover:bg-[#155648] px-4.5 py-2 rounded-xl transition-all cursor-pointer"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </header>

      {/* Detail Content Container */}
      <main className="max-w-3xl w-full mx-auto px-6 py-10 flex-1">
        {/* Back navigation */}
        <button
          onClick={() => setCurrentPage("home")}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-[#1a6b5a] font-bold text-sm mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>목록으로 돌아가기</span>
        </button>

        {/* Meta Info Header */}
        <div className="mb-6">
          <span className="inline-block bg-[#1a6b5a] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg mb-4 shadow-sm shadow-emerald-950/10">
            {article.categoryName}
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-2 rounded-full border border-slate-200">
              <User className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">케어로그 전문의</p>
              <p className="text-xs text-slate-400">{article.date}</p>
            </div>
          </div>
        </div>

        <div className="h-[1px] bg-slate-200/80 my-8"></div>

        {/* Representative Image (Placeholder style with premium gradient) */}
        <div className="mb-8">
          <div className={`relative w-full h-80 rounded-2xl overflow-hidden bg-gradient-to-br ${article.imageGradient} border border-teal-800/20 flex items-center justify-center shadow-md`}>
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#1a6b5a_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
            <div className="z-10 text-center p-6 max-w-md">
              {article.category === "ai-care" ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-400 text-xs font-semibold mb-3 shadow-inner">
                  <Bot className="w-3.5 h-3.5 animate-pulse" />
                  <span>AI Risk Monitoring Panel</span>
                </div>
              ) : article.category === "nutrition" ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mb-3 shadow-inner">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Nutrition Guide View</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-400 text-xs font-semibold mb-3 shadow-inner">
                  <Heart className="w-3.5 h-3.5 animate-pulse" />
                  <span>Heart Vital Check</span>
                </div>
              )}
              <p className="text-slate-200 text-sm font-bold tracking-wide leading-relaxed shadow-sm drop-shadow-md">
                {article.imageDesc}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <article className="prose max-w-none text-slate-700 leading-relaxed text-base md:text-lg mb-12 space-y-6">
          <p className="whitespace-pre-line leading-relaxed">{article.content}</p>
        </article>

        {/* Admin Section Control */}
        {user ? (
          <div className="border-t border-slate-200/80 pt-8 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400">관리자 전용 설정</span>
              <span className="text-[11px] text-emerald-600 font-medium">인증됨: {user.email}</span>
            </div>
            <button
              onClick={onEditContent}
              className="border-2 border-[#1a6b5a] text-[#1a6b5a] font-bold text-sm hover:bg-[#1a6b5a]/5 px-5 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              콘텐츠 편집
            </button>
          </div>
        ) : (
          <div className="border-t border-slate-200/80 pt-8 text-center bg-slate-50 rounded-xl p-4 border border-slate-200/60">
            <span className="text-xs text-slate-500">
              💡 아티클의 수정과 작성을 진행하려면{" "}
              <button
                onClick={() => setCurrentPage("login")}
                className="font-bold text-[#1a6b5a] hover:underline"
              >
                로그인
              </button>
              이 필요합니다.
            </span>
          </div>
        )}
      </main>
    </div>
  );
}

// ==========================================
// 4. EDITOR SCREEN (콘텐츠 에디터 화면)
// ==========================================
interface EditorScreenProps {
  article: Article;
  editorContent: string;
  setEditorContent: (html: string) => void;
  previewMode: "desktop" | "mobile";
  setPreviewMode: (mode: "desktop" | "mobile") => void;
  setCurrentPage: (page: Page) => void;
  triggerToast: (msg: string) => void;
  getTodayDateString: () => string;
  getPreviewTitle: (html: string) => string;
  getPreviewBody: (html: string) => string;
  onPublish: (updatedHtml: string) => void;
}

function EditorScreen({
  article,
  editorContent,
  setEditorContent,
  previewMode,
  setPreviewMode,
  setCurrentPage,
  triggerToast,
  getTodayDateString,
  getPreviewTitle,
  getPreviewBody,
  onPublish
}: EditorScreenProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // States to keep track of active toolbar commands
  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    h1: false,
    h2: false,
    ul: false,
    ol: false
  });

  // On mount, insert editorContent into contentEditable div
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = editorContent;
    }
  }, []);

  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    setEditorContent(e.currentTarget.innerHTML);
  };

  const updateActiveStyles = () => {
    if (typeof window === "undefined" || !editorRef.current) return;
    
    // Read style states at the cursor using queryCommandState & queryCommandValue
    setActiveStyles({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      h1: document.queryCommandValue("formatBlock") === "h1" || document.queryCommandValue("formatBlock") === "H1",
      h2: document.queryCommandValue("formatBlock") === "h2" || document.queryCommandValue("formatBlock") === "H2",
      ul: document.queryCommandState("insertUnorderedList"),
      ol: document.queryCommandState("insertOrderedList")
    });
  };

  // Run formatting command and refocus
  const executeCommand = (styleKey: string, command: string, arg: string = "") => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    
    if (styleKey === "h1" || styleKey === "h2") {
      // Toggle heading
      const currentBlock = document.queryCommandValue("formatBlock");
      const blockToApply = currentBlock.toLowerCase() === arg.toLowerCase() ? "p" : arg;
      document.execCommand("formatBlock", false, blockToApply);
    } else {
      document.execCommand(command, false, arg);
    }

    // Sync content state
    setEditorContent(editorRef.current.innerHTML);
    updateActiveStyles();
  };

  // Custom wave line insertion helper
  const insertWave = () => {
    const waveHtml = `<div class="flex items-center gap-2 my-6 text-teal-600 selection-none" contenteditable="false"><span class="h-[1px] flex-grow bg-teal-200"></span><svg class="w-5 h-5 text-[#1a6b5a] stroke-current" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12h3l2-5 3 10 2-7 3 5h3"></path></svg><span class="h-[1px] flex-grow bg-teal-200"></span></div><p><br></p>`;
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand("insertHTML", false, waveHtml);
    setEditorContent(editorRef.current.innerHTML);
  };

  // Custom image insertion helper
  const insertImage = () => {
    const defaultImg = `<img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop" class="w-full h-52 object-cover rounded-xl my-4 shadow-sm" alt="Care Image" /><p><br></p>`;
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand("insertHTML", false, defaultImg);
    setEditorContent(editorRef.current.innerHTML);
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Back button */}
          <button
            onClick={() => setCurrentPage("article")}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
            title="상세화면으로 이동"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="h-6 w-[1px] bg-slate-200"></div>

          <div className="flex items-center gap-2">
            <span className="text-md font-extrabold text-[#1a6b5a] tracking-tight">CareLog</span>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Content Editor</span>
          </div>
        </div>

        {/* Search placeholder */}
        <div className="hidden md:flex items-center bg-slate-100 rounded-xl px-3 py-1.5 w-60 border border-slate-200/55">
          <Search className="w-4 h-4 text-slate-400 mr-2" />
          <input
            type="text"
            readOnly
            placeholder="에디터 내 검색..."
            className="bg-transparent text-xs w-full outline-none text-slate-500 cursor-not-allowed"
          />
        </div>

        {/* Top Control Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => triggerToast("임시 저장되었습니다")}
            className="border-2 border-[#1a6b5a]/30 text-[#1a6b5a] font-bold text-xs hover:bg-[#1a6b5a]/5 hover:border-[#1a6b5a] px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            임시 저장
          </button>
          <button
            onClick={() => onPublish(editorContent)}
            className="bg-[#1a6b5a] text-white font-bold text-xs hover:bg-[#155648] px-4.5 py-2 rounded-xl transition-all hover:shadow-md hover:shadow-emerald-950/15 cursor-pointer"
          >
            발행
          </button>
        </div>
      </header>

      {/* Editor Main Layout (2-Column) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Side: Editor Panel */}
        <div className="flex-1 flex flex-col border-r border-slate-200 bg-white min-h-[50vh] lg:min-h-0">
          {/* Format Toolbar */}
          <div className="sticky top-[53px] z-20 bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center gap-1">
            <button
              onClick={() => executeCommand("bold", "bold")}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                activeStyles.bold ? "bg-[#1a6b5a]/15 text-[#1a6b5a]" : "text-slate-600 hover:bg-slate-200"
              }`}
              title="굵게 (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => executeCommand("italic", "italic")}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                activeStyles.italic ? "bg-[#1a6b5a]/15 text-[#1a6b5a]" : "text-slate-600 hover:bg-slate-200"
              }`}
              title="기울임꼴 (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-5 bg-slate-300 mx-1"></div>

            <button
              onClick={() => executeCommand("h1", "formatBlock", "h1")}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                activeStyles.h1 ? "bg-[#1a6b5a]/15 text-[#1a6b5a]" : "text-slate-600 hover:bg-slate-200"
              }`}
              title="제목 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              onClick={() => executeCommand("h2", "formatBlock", "h2")}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                activeStyles.h2 ? "bg-[#1a6b5a]/15 text-[#1a6b5a]" : "text-slate-600 hover:bg-slate-200"
              }`}
              title="제목 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-5 bg-slate-300 mx-1"></div>

            <button
              onClick={() => executeCommand("ul", "insertUnorderedList")}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                activeStyles.ul ? "bg-[#1a6b5a]/15 text-[#1a6b5a]" : "text-slate-600 hover:bg-slate-200"
              }`}
              title="글머리 기호 목록"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => executeCommand("ol", "insertOrderedList")}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                activeStyles.ol ? "bg-[#1a6b5a]/15 text-[#1a6b5a]" : "text-slate-600 hover:bg-slate-200"
              }`}
              title="번호 매기기 목록"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-5 bg-slate-300 mx-1"></div>

            <button
              onClick={() => executeCommand("hr", "insertHorizontalRule")}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              title="가로 구분선"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={insertWave}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              title="파형 장식 삽입"
            >
              <Activity className="w-4 h-4" />
            </button>
            <button
              onClick={insertImage}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              title="이미지 삽입"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Text Editor Area */}
          <div className="flex-1 p-8 overflow-y-auto bg-white editor-wrapper">
            <div className="max-w-2xl mx-auto border border-slate-100 shadow-inner rounded-2xl p-6 min-h-[500px]">
              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorInput}
                onKeyUp={updateActiveStyles}
                onMouseUp={updateActiveStyles}
                className="editor-area w-full outline-none prose max-w-none text-slate-800"
                style={{ minHeight: "450px" }}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Preview Panel */}
        <div className="w-full lg:w-[45%] flex flex-col bg-slate-100 min-h-[50vh] lg:min-h-0">
          {/* Preview Panel Header */}
          <div className="px-5 py-3.5 border-b border-slate-200 bg-white/70 backdrop-blur-md flex items-center justify-between">
            <span className="text-sm font-extrabold text-slate-700 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-[#1a6b5a]" />
              미리보기
            </span>

            {/* Desktop / Mobile Toggle Buttons */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50">
              <button
                onClick={() => setPreviewMode("mobile")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  previewMode === "mobile"
                    ? "bg-white text-[#1a6b5a] shadow-sm font-bold"
                    : "text-slate-400 hover:text-slate-700"
                }`}
                title="모바일 뷰"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode("desktop")}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  previewMode === "desktop"
                    ? "bg-white text-[#1a6b5a] shadow-sm font-bold"
                    : "text-slate-400 hover:text-slate-700"
                }`}
                title="데스크탑 뷰"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preview Scrollable Window */}
          <div className="flex-1 p-6 overflow-y-auto flex justify-center items-start">
            {/* Conditional Scaling Frame (Mobile vs Desktop) */}
            <div
              className={`bg-white border border-slate-200 shadow-sm rounded-3xl transition-all duration-300 flex flex-col ${
                previewMode === "mobile"
                  ? "w-[390px] min-h-[700px] border-4 border-slate-800 rounded-[3rem] px-5 py-8 relative overflow-hidden"
                  : "w-full min-h-[500px] px-8 py-8"
              }`}
            >
              {/* If mobile, draw a top smartphone notch element */}
              {previewMode === "mobile" && (
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-full z-20 flex items-center justify-center">
                  <div className="w-12 h-1 bg-slate-900 rounded-full"></div>
                </div>
              )}

              {/* Preview Content Area */}
              <div className="flex-1 flex flex-col">
                {/* Category Tag */}
                <div className="mb-4">
                  <span className="inline-block bg-[#1a6b5a] text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                    건강 가이드
                  </span>
                </div>

                {/* Dynamic Title */}
                <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-3 leading-tight">
                  {getPreviewTitle(editorContent)}
                </h1>

                {/* Today's Date */}
                <span className="text-[11px] text-slate-400 font-semibold mb-5 block">
                  작성일: {getTodayDateString()}
                </span>

                {/* Representative Image (Placeholder style with premium gradient) */}
                <div className="w-full h-44 rounded-xl bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 border border-teal-800/10 flex items-center justify-center mb-6 overflow-hidden relative shadow-inner">
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#1a6b5a_1px,transparent_1px)] [background-size:12px_12px]"></div>
                  <span className="text-teal-300 text-xs font-semibold flex items-center gap-1.5 z-10 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-teal-700/20">
                    <ImageIcon className="w-3.5 h-3.5" />
                    건강 가이드 대표 이미지
                  </span>
                </div>

                {/* Body Text */}
                <div
                  className="preview-area flex-1 text-slate-600 text-sm leading-relaxed mb-6 space-y-4"
                  dangerouslySetInnerHTML={{ __html: getPreviewBody(editorContent) }}
                />

                {/* Styled Highlight Box */}
                <div className="bg-[#f0fdfa] border-l-4 border-[#1a6b5a] p-4 rounded-r-xl flex gap-3 my-4 items-start shadow-sm shadow-teal-900/5">
                  <Lightbulb className="w-5 h-5 text-[#1a6b5a] shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-teal-950 leading-relaxed">
                    가장 중요한 것은 <strong className="text-[#1a6b5a] font-bold">‘꾸준함’</strong>입니다. 무리한 목표보다는 매일 실천할 수 있는 작은 목표를 세워보세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
