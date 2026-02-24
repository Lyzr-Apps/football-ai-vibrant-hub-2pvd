'use client'

import React, { useState, useCallback } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import parseLLMJson from '@/lib/jsonParser'
import { FiZap, FiPlay, FiGlobe, FiTrendingUp, FiSearch, FiClock, FiTarget, FiUsers, FiBarChart2, FiHash, FiChevronDown, FiChevronUp, FiStar, FiMapPin, FiAward, FiActivity, FiCalendar, FiMessageCircle, FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi'
import { BiFootball } from 'react-icons/bi'
import { RiFireFill, RiTiktokFill, RiYoutubeFill, RiTwitterXFill, RiInstagramFill } from 'react-icons/ri'
import { TbBrandYoutube } from 'react-icons/tb'

// ─── Agent IDs ───────────────────────────────────────────────
const MATCH_SCRIPT_AGENT = '699dd90e90552d84a0b08eda'
const AFRICAN_SPOTLIGHT_AGENT = '699dd90e29e0605963abe675'
const TRENDING_CONTENT_AGENT = '699dd90f89f6b3ac7d49e083'

// ─── TypeScript Interfaces ───────────────────────────────────
interface MatchAnalysis {
  teams?: string
  league?: string
  score_or_prediction?: string
  key_players?: string[]
  tactical_notes?: string
}

interface BodySegment {
  timestamp?: string
  content?: string
  visual_cue?: string
}

interface VideoScript {
  hook?: string
  intro?: string
  body_segments?: BodySegment[]
  outro?: string
  call_to_action?: string
}

interface SocialMedia {
  hashtags?: string[]
  caption?: string
  best_posting_time?: string
  platform_tips?: string[]
}

interface EngagementMetrics {
  estimated_reach?: string
  target_audience?: string
  viral_potential?: string
}

interface MatchScriptResponse {
  match_analysis?: MatchAnalysis
  video_script?: VideoScript
  social_media?: SocialMedia
  engagement_metrics?: EngagementMetrics
}

interface PlayerSpotlight {
  name?: string
  nationality?: string
  club?: string
  league?: string
  position?: string
  recent_form?: string
  career_highlights?: string[]
}

interface Headline {
  title?: string
  summary?: string
  region?: string
}

interface AfricanFootballNews {
  headlines?: Headline[]
  trending_transfers?: string[]
}

interface RisingTalent {
  name?: string
  age?: string
  club?: string
  potential_rating?: string
}

interface KenyanSpotlight {
  featured_story?: string
  kpl_updates?: string[]
  rising_talents?: RisingTalent[]
}

interface ContentPackage {
  article_draft?: string
  social_posts?: string[]
  video_script_hook?: string
  hashtags?: string[]
}

interface AfricanSpotlightResponse {
  player_spotlight?: PlayerSpotlight
  african_football_news?: AfricanFootballNews
  kenyan_spotlight?: KenyanSpotlight
  content_package?: ContentPackage
}

interface TrendingTopic {
  title?: string
  category?: string
  heat_score?: string
  summary?: string
}

interface TrendingTopics {
  topics?: TrendingTopic[]
  overall_trend_direction?: string
}

interface ViralMoment {
  description?: string
  platform?: string
  engagement_level?: string
  content_angle?: string
}

interface ViralMoments {
  moments?: ViralMoment[]
}

interface ContentPackages {
  tiktok_ideas?: string[]
  youtube_shorts?: string[]
  twitter_threads?: string[]
  instagram_reels?: string[]
}

interface DebateCorner {
  hot_take?: string
  arguments_for?: string[]
  arguments_against?: string[]
  poll_question?: string
}

interface ContentCalendar {
  today?: string[]
  this_week?: string[]
  predictions?: string[]
}

interface TrendingContentResponse {
  trending_topics?: TrendingTopics
  viral_moments?: ViralMoments
  content_packages?: ContentPackages
  debate_corner?: DebateCorner
  content_calendar?: ContentCalendar
}

// ─── Agent Info ──────────────────────────────────────────────
const AGENTS = [
  { id: MATCH_SCRIPT_AGENT, name: 'Match Script Generator', desc: 'Analyzes matches & generates viral video scripts' },
  { id: AFRICAN_SPOTLIGHT_AGENT, name: 'African Football Spotlight', desc: 'African player content with Kenyan focus' },
  { id: TRENDING_CONTENT_AGENT, name: 'Trending Content Curator', desc: 'Trending topics & viral content packages' },
]

// ─── Sample Data ─────────────────────────────────────────────
const SAMPLE_MATCH: MatchScriptResponse = {
  match_analysis: {
    teams: 'Arsenal vs Chelsea',
    league: 'Premier League',
    score_or_prediction: '2-1 (Arsenal Win)',
    key_players: ['Bukayo Saka', 'Martin Odegaard', 'Cole Palmer', 'Enzo Fernandez'],
    tactical_notes: 'Arsenal dominated possession with a high press, forcing Chelsea into long balls. Saka was instrumental on the right flank, creating 3 key chances. Chelsea struggled to build from the back under Arsenal\'s relentless pressing.'
  },
  video_script: {
    hook: 'ARSENAL JUST DESTROYED CHELSEA! You won\'t believe Saka\'s goal...',
    intro: 'The North London giants showed up BIG in this Premier League clash. Let me break down what happened...',
    body_segments: [
      { timestamp: '0:00-0:15', content: 'Open with Saka\'s incredible run past 3 defenders', visual_cue: 'Slow-motion highlight reel with bass drop' },
      { timestamp: '0:15-0:45', content: 'Tactical breakdown of Arsenal\'s high press', visual_cue: 'Overhead tactical diagram with arrows' },
      { timestamp: '0:45-1:00', content: 'Chelsea\'s response and Palmer\'s consolation goal', visual_cue: 'Split screen comparison' }
    ],
    outro: 'Arsenal move 5 points clear at the top. Can anyone stop them?',
    call_to_action: 'Drop your score predictions for the next match in the comments!'
  },
  social_media: {
    hashtags: ['#Arsenal', '#Chelsea', '#PremierLeague', '#Saka', '#MatchDay', '#FootballPulse'],
    caption: 'Arsenal 2-1 Chelsea: Saka masterclass seals London derby! Full analysis...',
    best_posting_time: '6:00 PM GMT - Peak engagement window post-match',
    platform_tips: ['Use vertical format for TikTok/Reels', 'Add captions for muted autoplay', 'Post highlight clip within 30 min of final whistle', 'Engage with fan comments in first hour']
  },
  engagement_metrics: {
    estimated_reach: '500K - 1.2M views across platforms',
    target_audience: 'Premier League fans, Arsenal supporters, football content enthusiasts aged 18-35',
    viral_potential: '85%'
  }
}

const SAMPLE_AFRICAN: AfricanSpotlightResponse = {
  player_spotlight: {
    name: 'Victor Wanyama',
    nationality: 'Kenya',
    club: 'CF Montreal (Former)',
    league: 'MLS / Retired Legend',
    position: 'Defensive Midfielder',
    recent_form: 'Retired - Now focusing on mentoring young Kenyan talent and community football projects',
    career_highlights: ['First Kenyan to play in Premier League', 'Champions League semi-finalist with Tottenham', 'Over 60 caps for Harambee Stars', 'AFCON qualifier hero for Kenya']
  },
  african_football_news: {
    headlines: [
      { title: 'AFCON 2025 Draw Shakes Up African Football', summary: 'The draw for AFCON 2025 has produced exciting groups with traditional rivals meeting early.', region: 'Continental' },
      { title: 'Kenyan Premier League Gets New Broadcasting Deal', summary: 'A landmark broadcasting deal will bring KPL matches to millions of Kenyan fans.', region: 'Kenya' },
      { title: 'Nigerian Stars Shine in Champions League', summary: 'Victor Osimhen and others deliver standout performances in European club competition.', region: 'West Africa' }
    ],
    trending_transfers: ['Michael Olunga linked with European return', 'Kenyan U-20 star scouted by Bundesliga clubs', 'South African midfielder moves to Premier League']
  },
  kenyan_spotlight: {
    featured_story: 'The rise of Kenyan football academies is transforming the talent pipeline. With 15 new FIFA-certified academies opening across Nairobi and Mombasa, Kenya is positioning itself as an African football powerhouse.',
    kpl_updates: ['Gor Mahia leads KPL standings after 12 match unbeaten run', 'AFC Leopards secure new sponsorship deal', 'Tusker FC youth academy produces 3 national team call-ups'],
    rising_talents: [
      { name: 'James Ochieng', age: '19', club: 'Gor Mahia', potential_rating: '92/100' },
      { name: 'Brian Wafula', age: '20', club: 'AFC Leopards', potential_rating: '88/100' },
      { name: 'Kevin Mwangi', age: '18', club: 'Tusker FC', potential_rating: '90/100' }
    ]
  },
  content_package: {
    article_draft: '# The Rise of Kenyan Football\n\nKenya\'s football scene is undergoing a remarkable transformation. From grassroots academies to the professional league, the country is producing talent that\'s catching the eye of European scouts.\n\n## Academy Revolution\n\nWith 15 new FIFA-certified academies, the pipeline of talent has never been stronger.\n\n## Key Players to Watch\n\nJames Ochieng at Gor Mahia is leading the charge with 12 goals in 15 matches this season.',
    social_posts: ['Did you know Kenya has produced 15 FIFA-certified football academies? The future is bright!', 'James Ochieng: 19 years old, 12 goals, and European scouts are watching. Remember the name.', 'From Nairobi to the world stage - Kenyan football is having its moment.'],
    video_script_hook: 'Kenya is quietly building a FOOTBALL EMPIRE and nobody is talking about it...',
    hashtags: ['#KenyanFootball', '#HarambeeStars', '#KPL', '#AfricanFootball', '#RisingStars']
  }
}

const SAMPLE_TRENDING: TrendingContentResponse = {
  trending_topics: {
    topics: [
      { title: 'Champions League Drama', category: 'European Football', heat_score: '95', summary: 'Shocking upsets in the Champions League knockout rounds have social media exploding.' },
      { title: 'Transfer Window Madness', category: 'Transfers', heat_score: '88', summary: 'Last-minute deals and surprise moves dominating headlines worldwide.' },
      { title: 'VAR Controversy Continues', category: 'Debate', heat_score: '76', summary: 'Another weekend of questionable VAR decisions sparking heated debate.' },
      { title: 'African Players Dominating Europe', category: 'African Football', heat_score: '82', summary: 'Record number of African players scoring in top 5 European leagues.' }
    ],
    overall_trend_direction: 'European competition drama and transfer speculation dominating, with growing African football narrative.'
  },
  viral_moments: {
    moments: [
      { description: 'Goalkeeper scores bicycle kick in 90th minute to win the match', platform: 'TikTok', engagement_level: 'Extremely High', content_angle: 'The impossible goal - when goalkeepers attack' },
      { description: 'Manager celebrates by sliding on wet pitch, goes viral', platform: 'Twitter/X', engagement_level: 'High', content_angle: 'Football managers are entertainers too' },
      { description: 'Fan catches ball one-handed while holding baby', platform: 'Instagram', engagement_level: 'Very High', content_angle: 'Superdad moment at the stadium' }
    ]
  },
  content_packages: {
    tiktok_ideas: ['POV: You predicted the Champions League upsets', 'Ranking every transfer this window from W to L', 'Things only real football fans understand'],
    youtube_shorts: ['60-second Champions League recap with dramatic music', 'Top 5 African players this season - quick fire rankings', 'VAR fails compilation with commentary'],
    twitter_threads: ['Thread: Why this Champions League season is the most dramatic ever', 'Breaking down every major transfer and what it means', 'Hot take: VAR has improved football - here\'s the data'],
    instagram_reels: ['Transition edit: worst to best goals this week', 'Day in the life of a football content creator', 'Quick quiz: guess the player from their boots']
  },
  debate_corner: {
    hot_take: 'VAR has made football BETTER, not worse. The data proves it.',
    arguments_for: ['Fewer incorrect penalty decisions', 'Offside accuracy improved by 98%', 'Red card decisions more consistent across leagues'],
    arguments_against: ['Kills the raw emotion of goal celebrations', 'Inconsistent application across different leagues', 'Takes too long for decisions, disrupting game flow'],
    poll_question: 'Has VAR improved football? Yes or No?'
  },
  content_calendar: {
    today: ['Post Champions League reaction video', 'Create transfer rumor roundup graphic', 'Go live for post-match analysis'],
    this_week: ['Tuesday: Champions League matchday content', 'Wednesday: Mid-week stats breakdown', 'Friday: Weekend predictions video', 'Saturday: Live match day coverage'],
    predictions: ['Champions League final will be an all-English affair', 'At least 3 African players in PFA Team of the Year', 'Transfer record to be broken this summer']
  }
}

// ─── Markdown Renderer ──────────────────────────────────────
function formatInline(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-foreground">
        {part}
      </strong>
    ) : (
      part
    )
  )
}

function renderMarkdown(text: string) {
  if (!text) return null
  return (
    <div className="space-y-2">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('### '))
          return <h4 key={i} className="font-semibold text-sm mt-3 mb-1 text-foreground">{line.slice(4)}</h4>
        if (line.startsWith('## '))
          return <h3 key={i} className="font-semibold text-base mt-3 mb-1 text-foreground">{line.slice(3)}</h3>
        if (line.startsWith('# '))
          return <h2 key={i} className="font-bold text-lg mt-4 mb-2 text-foreground">{line.slice(2)}</h2>
        if (line.startsWith('- ') || line.startsWith('* '))
          return <li key={i} className="ml-4 list-disc text-sm text-muted-foreground">{formatInline(line.slice(2))}</li>
        if (/^\d+\.\s/.test(line))
          return <li key={i} className="ml-4 list-decimal text-sm text-muted-foreground">{formatInline(line.replace(/^\d+\.\s/, ''))}</li>
        if (!line.trim()) return <div key={i} className="h-1" />
        return <p key={i} className="text-sm text-muted-foreground">{formatInline(line)}</p>
      })}
    </div>
  )
}

// ─── ErrorBoundary ───────────────────────────────────────────
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4 text-sm">{this.state.error}</p>
            <button onClick={() => this.setState({ hasError: false, error: '' })} className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm">
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

// ─── Helper: Heat Score to percentage ────────────────────────
function parseHeatScore(score?: string): number {
  if (!score) return 0
  const n = parseInt(score, 10)
  return isNaN(n) ? 50 : Math.min(100, Math.max(0, n))
}

// ─── Helper: Viral Potential to percentage ───────────────────
function parsePercentage(val?: string): number {
  if (!val) return 0
  const n = parseInt(val.replace('%', ''), 10)
  return isNaN(n) ? 50 : Math.min(100, Math.max(0, n))
}

// ─── Helper: Engagement Level to color ───────────────────────
function engagementColor(level?: string): string {
  const l = (level ?? '').toLowerCase()
  if (l.includes('extremely') || l.includes('very high')) return 'text-green-400'
  if (l.includes('high')) return 'text-emerald-400'
  if (l.includes('medium')) return 'text-yellow-400'
  return 'text-muted-foreground'
}

// ─── Helper: Platform icon ───────────────────────────────────
function PlatformIcon({ platform }: { platform?: string }) {
  const p = (platform ?? '').toLowerCase()
  if (p.includes('tiktok')) return <RiTiktokFill className="w-4 h-4" />
  if (p.includes('youtube')) return <TbBrandYoutube className="w-4 h-4" />
  if (p.includes('twitter') || p.includes('x')) return <RiTwitterXFill className="w-4 h-4" />
  if (p.includes('instagram')) return <RiInstagramFill className="w-4 h-4" />
  return <FiGlobe className="w-4 h-4" />
}

// ─── GlassCard Component ─────────────────────────────────────
function GlassCard({ title, icon, children, className }: { title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card/80 backdrop-blur-[12px] border border-white/10 rounded p-5 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.1)] ${className ?? ''}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-primary">{icon}</span>
        <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">{title}</h3>
        <div className="flex-1 h-px bg-gradient-to-r from-primary/40 to-transparent ml-2" />
      </div>
      {children}
    </div>
  )
}

// ─── HashtagChip Component ───────────────────────────────────
function HashtagChip({ tag }: { tag: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(tag).then(() => {
      setCopied(true)
      const timer = setTimeout(() => setCopied(false), 1500)
      return () => clearTimeout(timer)
    }).catch(() => {})
  }, [tag])

  return (
    <button onClick={handleCopy} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded border border-primary/40 text-primary bg-primary/10 hover:bg-primary/20 transition-all duration-200 hover:shadow-[0_0_8px_rgba(0,255,255,0.2)]">
      <FiHash className="w-3 h-3" />
      {tag.replace('#', '')}
      {copied && <FiCheck className="w-3 h-3 text-green-400" />}
    </button>
  )
}

// ─── ProgressBar Component ───────────────────────────────────
function ProgressBar({ value, color }: { value: number; color?: string }) {
  return (
    <div className="w-full bg-muted rounded-sm h-2 overflow-hidden">
      <div className={`h-full rounded-sm transition-all duration-500 ${color ?? 'bg-primary'}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}

// ─── Tab 1: Match Scripts ────────────────────────────────────
function MatchScriptsTab({ showSample, activeAgentId, setActiveAgentId }: { showSample: boolean; activeAgentId: string | null; setActiveAgentId: (id: string | null) => void }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<MatchScriptResponse | null>(null)
  const [expandedSegments, setExpandedSegments] = useState<Record<number, boolean>>({})

  const displayData = showSample ? SAMPLE_MATCH : data

  const handleGenerate = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError(null)
    setData(null)
    setActiveAgentId(MATCH_SCRIPT_AGENT)
    try {
      const result = await callAIAgent(input.trim(), MATCH_SCRIPT_AGENT)
      if (result.success) {
        const parsed = parseLLMJson(result.response)
        setData(parsed as MatchScriptResponse)
      } else {
        setError(result.error ?? 'Failed to generate match script')
      }
    } catch (e: any) {
      setError(e?.message ?? 'An unexpected error occurred')
    } finally {
      setLoading(false)
      setActiveAgentId(null)
    }
  }

  const toggleSegment = (idx: number) => {
    setExpandedSegments(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="bg-card/80 backdrop-blur-[12px] border border-white/10 rounded p-5">
        <label className="block text-sm font-medium text-foreground mb-2">Enter match details</label>
        <div className="flex gap-3">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !loading && handleGenerate()} placeholder="e.g. Arsenal vs Chelsea Premier League" className="flex-1 bg-input border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
          <button onClick={handleGenerate} disabled={loading || !input.trim()} className="inline-flex items-center gap-2 px-5 py-2 rounded bg-primary text-primary-foreground font-medium text-sm shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiPlay className="w-4 h-4" />}
            {loading ? 'Generating...' : 'Generate Script'}
          </button>
        </div>
        {error && (
          <div className="mt-3 flex items-center gap-2 text-destructive text-sm">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Analyzing match and generating script...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !displayData && !error && (
        <div className="text-center py-16">
          <BiFootball className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground text-sm">Enter a match to analyze and generate a viral video script</p>
          <p className="text-muted-foreground/60 text-xs mt-1">Try &quot;Arsenal vs Chelsea Premier League&quot; or toggle Sample Data</p>
        </div>
      )}

      {/* Results */}
      {!loading && displayData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Match Analysis */}
          <GlassCard title="Match Analysis" icon={<BiFootball className="w-5 h-5" />}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">{displayData.match_analysis?.teams ?? 'N/A'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-0.5 text-xs rounded bg-secondary/20 text-secondary border border-secondary/30">{displayData.match_analysis?.league ?? 'N/A'}</span>
                <span className="px-2 py-0.5 text-xs rounded bg-accent/20 text-accent border border-accent/30 font-bold">{displayData.match_analysis?.score_or_prediction ?? 'N/A'}</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Key Players</p>
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(displayData.match_analysis?.key_players) && displayData.match_analysis.key_players.map((p, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs rounded bg-primary/10 text-primary border border-primary/30">{p}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Tactical Notes</p>
                <p className="text-sm text-muted-foreground">{displayData.match_analysis?.tactical_notes ?? ''}</p>
              </div>
            </div>
          </GlassCard>

          {/* Video Script */}
          <GlassCard title="Video Script" icon={<FiPlay className="w-5 h-5" />} className="lg:row-span-2">
            <div className="space-y-4">
              {/* Hook */}
              <div className="bg-accent/10 border border-accent/30 rounded p-3">
                <p className="text-xs text-accent uppercase tracking-wider mb-1 font-bold">Hook</p>
                <p className="text-sm text-foreground font-medium">{displayData.video_script?.hook ?? ''}</p>
              </div>
              {/* Intro */}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Intro</p>
                <p className="text-sm text-muted-foreground">{displayData.video_script?.intro ?? ''}</p>
              </div>
              {/* Body Segments */}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Body Segments</p>
                <div className="space-y-2">
                  {Array.isArray(displayData.video_script?.body_segments) && displayData.video_script.body_segments.map((seg, i) => (
                    <div key={i} className="border border-border/50 rounded overflow-hidden">
                      <button onClick={() => toggleSegment(i)} className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-2">
                          <FiClock className="w-3 h-3 text-primary" />
                          <span className="text-xs font-mono text-primary">{seg?.timestamp ?? ''}</span>
                        </div>
                        {expandedSegments[i] ? <FiChevronUp className="w-3 h-3 text-muted-foreground" /> : <FiChevronDown className="w-3 h-3 text-muted-foreground" />}
                      </button>
                      {expandedSegments[i] && (
                        <div className="px-3 pb-3 space-y-2">
                          <p className="text-sm text-muted-foreground">{seg?.content ?? ''}</p>
                          <div className="flex items-center gap-1 text-xs text-secondary">
                            <FiActivity className="w-3 h-3" />
                            <span>{seg?.visual_cue ?? ''}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Outro */}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Outro</p>
                <p className="text-sm text-muted-foreground">{displayData.video_script?.outro ?? ''}</p>
              </div>
              {/* CTA */}
              <div className="bg-primary/10 border border-primary/30 rounded p-3">
                <p className="text-xs text-primary uppercase tracking-wider mb-1 font-bold">Call to Action</p>
                <p className="text-sm text-foreground">{displayData.video_script?.call_to_action ?? ''}</p>
              </div>
            </div>
          </GlassCard>

          {/* Social Media */}
          <GlassCard title="Social Media" icon={<FiHash className="w-5 h-5" />}>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Caption</p>
                <p className="text-sm text-muted-foreground">{displayData.social_media?.caption ?? ''}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Hashtags</p>
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(displayData.social_media?.hashtags) && displayData.social_media.hashtags.map((tag, i) => (
                    <HashtagChip key={i} tag={tag} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">{displayData.social_media?.best_posting_time ?? ''}</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Platform Tips</p>
                <ul className="space-y-1.5">
                  {Array.isArray(displayData.social_media?.platform_tips) && displayData.social_media.platform_tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <FiChevronDown className="w-3 h-3 text-primary mt-1 rotate-[-90deg] flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </GlassCard>

          {/* Engagement Metrics */}
          <GlassCard title="Engagement Metrics" icon={<FiBarChart2 className="w-5 h-5" />}>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Viral Potential</span>
                  <span className="text-sm font-bold text-accent">{displayData.engagement_metrics?.viral_potential ?? 'N/A'}</span>
                </div>
                <ProgressBar value={parsePercentage(displayData.engagement_metrics?.viral_potential)} color="bg-gradient-to-r from-primary to-accent" />
              </div>
              <div className="flex items-start gap-2">
                <FiTarget className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Estimated Reach</p>
                  <p className="text-sm text-foreground font-medium">{displayData.engagement_metrics?.estimated_reach ?? 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FiUsers className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Target Audience</p>
                  <p className="text-sm text-muted-foreground">{displayData.engagement_metrics?.target_audience ?? 'N/A'}</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}

// ─── Tab 2: African Spotlight ────────────────────────────────
function AfricanSpotlightTab({ showSample, activeAgentId, setActiveAgentId }: { showSample: boolean; activeAgentId: string | null; setActiveAgentId: (id: string | null) => void }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<AfricanSpotlightResponse | null>(null)
  const [showArticle, setShowArticle] = useState(false)

  const displayData = showSample ? SAMPLE_AFRICAN : data

  const handleSearch = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError(null)
    setData(null)
    setActiveAgentId(AFRICAN_SPOTLIGHT_AGENT)
    try {
      const result = await callAIAgent(input.trim(), AFRICAN_SPOTLIGHT_AGENT)
      if (result.success) {
        const parsed = parseLLMJson(result.response)
        setData(parsed as AfricanSpotlightResponse)
      } else {
        setError(result.error ?? 'Failed to get spotlight')
      }
    } catch (e: any) {
      setError(e?.message ?? 'An unexpected error occurred')
    } finally {
      setLoading(false)
      setActiveAgentId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="bg-card/80 backdrop-blur-[12px] border border-white/10 rounded p-5">
        <label className="block text-sm font-medium text-foreground mb-2">Player name or topic</label>
        <div className="flex gap-3">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !loading && handleSearch()} placeholder="e.g. Victor Wanyama or Kenyan Premier League updates" className="flex-1 bg-input border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
          <button onClick={handleSearch} disabled={loading || !input.trim()} className="inline-flex items-center gap-2 px-5 py-2 rounded bg-primary text-primary-foreground font-medium text-sm shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiSearch className="w-4 h-4" />}
            {loading ? 'Searching...' : 'Get Spotlight'}
          </button>
        </div>
        {error && (
          <div className="mt-3 flex items-center gap-2 text-destructive text-sm">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Spotlighting African football talent...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !displayData && !error && (
        <div className="text-center py-16">
          <FiGlobe className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground text-sm">Search for African football players or topics</p>
          <p className="text-muted-foreground/60 text-xs mt-1">Try &quot;Victor Wanyama&quot; or toggle Sample Data</p>
        </div>
      )}

      {/* Results */}
      {!loading && displayData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Player Spotlight */}
          <GlassCard title="Player Spotlight" icon={<FiStar className="w-5 h-5" />}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-foreground">{displayData.player_spotlight?.name ?? 'N/A'}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5">
                  <FiMapPin className="w-3 h-3 text-accent" />
                  <span className="text-xs text-muted-foreground">{displayData.player_spotlight?.nationality ?? 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BiFootball className="w-3 h-3 text-primary" />
                  <span className="text-xs text-muted-foreground">{displayData.player_spotlight?.club ?? 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FiActivity className="w-3 h-3 text-secondary" />
                  <span className="text-xs text-muted-foreground">{displayData.player_spotlight?.league ?? 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FiTarget className="w-3 h-3 text-primary" />
                  <span className="text-xs text-muted-foreground">{displayData.player_spotlight?.position ?? 'N/A'}</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Recent Form</p>
                <p className="text-sm text-muted-foreground">{displayData.player_spotlight?.recent_form ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Career Highlights</p>
                <ul className="space-y-1">
                  {Array.isArray(displayData.player_spotlight?.career_highlights) && displayData.player_spotlight.career_highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <FiAward className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </GlassCard>

          {/* African Football News */}
          <GlassCard title="African Football News" icon={<FiGlobe className="w-5 h-5" />}>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Headlines</p>
              <div className="space-y-2">
                {Array.isArray(displayData.african_football_news?.headlines) && displayData.african_football_news.headlines.map((hl, i) => (
                  <div key={i} className="bg-muted/30 rounded p-3 border border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{hl?.title ?? ''}</span>
                      <span className="px-1.5 py-0.5 text-[10px] rounded bg-secondary/20 text-secondary border border-secondary/30">{hl?.region ?? ''}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{hl?.summary ?? ''}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Trending Transfers</p>
                <ul className="space-y-1">
                  {Array.isArray(displayData.african_football_news?.trending_transfers) && displayData.african_football_news.trending_transfers.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <FiTrendingUp className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </GlassCard>

          {/* Kenyan Spotlight */}
          <GlassCard title="Kenyan Spotlight" icon={<FiMapPin className="w-5 h-5" />}>
            <div className="space-y-3">
              {/* Featured Story */}
              <div className="bg-accent/10 border border-accent/30 rounded p-3">
                <p className="text-xs text-accent uppercase tracking-wider mb-1 font-bold">Featured Story</p>
                <p className="text-sm text-muted-foreground">{displayData.kenyan_spotlight?.featured_story ?? ''}</p>
              </div>
              {/* KPL Updates */}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">KPL Updates</p>
                <ul className="space-y-1">
                  {Array.isArray(displayData.kenyan_spotlight?.kpl_updates) && displayData.kenyan_spotlight.kpl_updates.map((u, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <BiFootball className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Rising Talents */}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Rising Talents</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-1.5 text-muted-foreground font-medium">Name</th>
                        <th className="text-left py-1.5 text-muted-foreground font-medium">Age</th>
                        <th className="text-left py-1.5 text-muted-foreground font-medium">Club</th>
                        <th className="text-left py-1.5 text-muted-foreground font-medium">Potential</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(displayData.kenyan_spotlight?.rising_talents) && displayData.kenyan_spotlight.rising_talents.map((talent, i) => (
                        <tr key={i} className="border-b border-border/20">
                          <td className="py-1.5 text-foreground font-medium">{talent?.name ?? ''}</td>
                          <td className="py-1.5 text-muted-foreground">{talent?.age ?? ''}</td>
                          <td className="py-1.5 text-muted-foreground">{talent?.club ?? ''}</td>
                          <td className="py-1.5">
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary border border-primary/30 font-bold">{talent?.potential_rating ?? ''}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Content Package */}
          <GlassCard title="Content Package" icon={<FiMessageCircle className="w-5 h-5" />}>
            <div className="space-y-3">
              {/* Article Draft */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Article Draft</p>
                  <button onClick={() => setShowArticle(!showArticle)} className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                    {showArticle ? 'Collapse' : 'Expand'}
                    {showArticle ? <FiChevronUp className="w-3 h-3" /> : <FiChevronDown className="w-3 h-3" />}
                  </button>
                </div>
                {showArticle && (
                  <div className="bg-muted/30 rounded p-3 border border-white/5 max-h-60 overflow-y-auto">
                    {renderMarkdown(displayData.content_package?.article_draft ?? '')}
                  </div>
                )}
                {!showArticle && (
                  <p className="text-xs text-muted-foreground/60 italic">Click expand to view full article draft</p>
                )}
              </div>
              {/* Video Script Hook */}
              <div className="bg-accent/10 border border-accent/30 rounded p-3">
                <p className="text-xs text-accent uppercase tracking-wider mb-1 font-bold">Video Script Hook</p>
                <p className="text-sm text-foreground">{displayData.content_package?.video_script_hook ?? ''}</p>
              </div>
              {/* Social Posts */}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">Social Posts</p>
                <div className="space-y-1.5">
                  {Array.isArray(displayData.content_package?.social_posts) && displayData.content_package.social_posts.map((post, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/20 rounded p-2">
                      <FiMessageCircle className="w-3 h-3 text-secondary mt-0.5 flex-shrink-0" />
                      <span>{post}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Hashtags */}
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Hashtags</p>
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(displayData.content_package?.hashtags) && displayData.content_package.hashtags.map((tag, i) => (
                    <HashtagChip key={i} tag={tag} />
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}

// ─── Tab 3: Trending Content ─────────────────────────────────
function TrendingContentTab({ showSample, activeAgentId, setActiveAgentId }: { showSample: boolean; activeAgentId: string | null; setActiveAgentId: (id: string | null) => void }) {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<TrendingContentResponse | null>(null)
  const [contentPlatform, setContentPlatform] = useState<'tiktok' | 'youtube' | 'twitter' | 'instagram'>('tiktok')

  const displayData = showSample ? SAMPLE_TRENDING : data

  const handleSearch = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError(null)
    setData(null)
    setActiveAgentId(TRENDING_CONTENT_AGENT)
    try {
      const result = await callAIAgent(input.trim(), TRENDING_CONTENT_AGENT)
      if (result.success) {
        const parsed = parseLLMJson(result.response)
        setData(parsed as TrendingContentResponse)
      } else {
        setError(result.error ?? 'Failed to find trends')
      }
    } catch (e: any) {
      setError(e?.message ?? 'An unexpected error occurred')
    } finally {
      setLoading(false)
      setActiveAgentId(null)
    }
  }

  const platformItems = (() => {
    if (!displayData?.content_packages) return []
    switch (contentPlatform) {
      case 'tiktok': return Array.isArray(displayData.content_packages.tiktok_ideas) ? displayData.content_packages.tiktok_ideas : []
      case 'youtube': return Array.isArray(displayData.content_packages.youtube_shorts) ? displayData.content_packages.youtube_shorts : []
      case 'twitter': return Array.isArray(displayData.content_packages.twitter_threads) ? displayData.content_packages.twitter_threads : []
      case 'instagram': return Array.isArray(displayData.content_packages.instagram_reels) ? displayData.content_packages.instagram_reels : []
      default: return []
    }
  })()

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="bg-card/80 backdrop-blur-[12px] border border-white/10 rounded p-5">
        <label className="block text-sm font-medium text-foreground mb-2">Enter trending topic</label>
        <div className="flex gap-3">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !loading && handleSearch()} placeholder="e.g. Champions League drama or What's trending in football" className="flex-1 bg-input border border-border rounded px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
          <button onClick={handleSearch} disabled={loading || !input.trim()} className="inline-flex items-center gap-2 px-5 py-2 rounded bg-primary text-primary-foreground font-medium text-sm shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiTrendingUp className="w-4 h-4" />}
            {loading ? 'Finding...' : 'Find Trends'}
          </button>
        </div>
        {error && (
          <div className="mt-3 flex items-center gap-2 text-destructive text-sm">
            <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="text-sm text-muted-foreground animate-pulse">Curating trending football content...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !displayData && !error && (
        <div className="text-center py-16">
          <FiTrendingUp className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground text-sm">Discover what is trending in football</p>
          <p className="text-muted-foreground/60 text-xs mt-1">Try &quot;Champions League drama&quot; or toggle Sample Data</p>
        </div>
      )}

      {/* Results */}
      {!loading && displayData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Trending Topics */}
          <GlassCard title="Trending Topics" icon={<RiFireFill className="w-5 h-5" />}>
            <div className="space-y-3">
              {displayData.trending_topics?.overall_trend_direction && (
                <p className="text-xs text-muted-foreground italic border-b border-border/30 pb-2">{displayData.trending_topics.overall_trend_direction}</p>
              )}
              {Array.isArray(displayData.trending_topics?.topics) && displayData.trending_topics.topics.map((topic, i) => (
                <div key={i} className="bg-muted/30 rounded p-3 border border-white/5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-foreground">{topic?.title ?? ''}</span>
                    <span className="px-1.5 py-0.5 text-[10px] rounded bg-secondary/20 text-secondary border border-secondary/30">{topic?.category ?? ''}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{topic?.summary ?? ''}</p>
                  <div className="flex items-center gap-2">
                    <RiFireFill className="w-3 h-3 text-destructive" />
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Heat</span>
                    <div className="flex-1">
                      <ProgressBar value={parseHeatScore(topic?.heat_score)} color="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500" />
                    </div>
                    <span className="text-xs font-bold text-accent">{topic?.heat_score ?? '0'}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Viral Moments */}
          <GlassCard title="Viral Moments" icon={<FiZap className="w-5 h-5" />}>
            <div className="space-y-3">
              {Array.isArray(displayData.viral_moments?.moments) && displayData.viral_moments.moments.map((moment, i) => (
                <div key={i} className="bg-muted/30 rounded p-3 border border-white/5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <PlatformIcon platform={moment?.platform} />
                    <span className="text-xs text-muted-foreground">{moment?.platform ?? ''}</span>
                    <span className={`text-xs font-bold ml-auto ${engagementColor(moment?.engagement_level)}`}>{moment?.engagement_level ?? ''}</span>
                  </div>
                  <p className="text-sm text-foreground mb-1">{moment?.description ?? ''}</p>
                  <p className="text-xs text-primary italic">{moment?.content_angle ?? ''}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Content Packages */}
          <GlassCard title="Content Packages" icon={<FiPlay className="w-5 h-5" />}>
            <div className="space-y-3">
              {/* Platform tabs */}
              <div className="flex gap-1 p-0.5 bg-muted/40 rounded">
                {([
                  { key: 'tiktok' as const, label: 'TikTok', icon: <RiTiktokFill className="w-3 h-3" /> },
                  { key: 'youtube' as const, label: 'Shorts', icon: <RiYoutubeFill className="w-3 h-3" /> },
                  { key: 'twitter' as const, label: 'X', icon: <RiTwitterXFill className="w-3 h-3" /> },
                  { key: 'instagram' as const, label: 'Reels', icon: <RiInstagramFill className="w-3 h-3" /> },
                ]).map((p) => (
                  <button key={p.key} onClick={() => setContentPlatform(p.key)} className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-xs font-medium transition-all ${contentPlatform === p.key ? 'bg-primary text-primary-foreground shadow-[0_0_10px_rgba(0,255,255,0.3)]' : 'text-muted-foreground hover:text-foreground'}`}>
                    {p.icon}
                    {p.label}
                  </button>
                ))}
              </div>
              {/* Items */}
              <div className="space-y-1.5">
                {platformItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/20 rounded p-2.5">
                    <span className="text-xs text-primary font-bold mt-0.5">{i + 1}.</span>
                    <span>{item}</span>
                  </div>
                ))}
                {platformItems.length === 0 && (
                  <p className="text-xs text-muted-foreground/60 italic text-center py-4">No content ideas available for this platform</p>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Debate Corner */}
          <GlassCard title="Debate Corner" icon={<FiMessageCircle className="w-5 h-5" />}>
            <div className="space-y-3">
              {/* Hot Take */}
              <div className="bg-destructive/10 border border-destructive/30 rounded p-3">
                <p className="text-xs text-destructive uppercase tracking-wider mb-1 font-bold flex items-center gap-1">
                  <RiFireFill className="w-3 h-3" /> Hot Take
                </p>
                <p className="text-sm text-foreground font-medium">{displayData.debate_corner?.hot_take ?? ''}</p>
              </div>
              {/* Arguments */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-green-400 uppercase tracking-wider mb-1.5 font-bold">For</p>
                  <ul className="space-y-1">
                    {Array.isArray(displayData.debate_corner?.arguments_for) && displayData.debate_corner.arguments_for.map((arg, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <FiCheck className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{arg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs text-red-400 uppercase tracking-wider mb-1.5 font-bold">Against</p>
                  <ul className="space-y-1">
                    {Array.isArray(displayData.debate_corner?.arguments_against) && displayData.debate_corner.arguments_against.map((arg, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <FiAlertCircle className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                        <span>{arg}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* Poll Question */}
              <div className="bg-primary/10 border border-primary/30 rounded p-3">
                <p className="text-xs text-primary uppercase tracking-wider mb-1 font-bold">Poll Question</p>
                <p className="text-sm text-foreground">{displayData.debate_corner?.poll_question ?? ''}</p>
              </div>
            </div>
          </GlassCard>

          {/* Content Calendar */}
          <GlassCard title="Content Calendar" icon={<FiCalendar className="w-5 h-5" />} className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Today */}
              <div>
                <p className="text-xs text-accent uppercase tracking-wider mb-2 font-bold">Today</p>
                <ul className="space-y-1.5">
                  {Array.isArray(displayData.content_calendar?.today) && displayData.content_calendar.today.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <FiClock className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* This Week */}
              <div>
                <p className="text-xs text-primary uppercase tracking-wider mb-2 font-bold">This Week</p>
                <ul className="space-y-1.5">
                  {Array.isArray(displayData.content_calendar?.this_week) && displayData.content_calendar.this_week.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <FiCalendar className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Predictions */}
              <div>
                <p className="text-xs text-secondary uppercase tracking-wider mb-2 font-bold">Predictions</p>
                <ul className="space-y-1.5">
                  {Array.isArray(displayData.content_calendar?.predictions) && displayData.content_calendar.predictions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <FiTarget className="w-3 h-3 text-secondary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}

// ─── Main Page Component ─────────────────────────────────────
export default function Page() {
  const [activeTab, setActiveTab] = useState<'match' | 'african' | 'trending'>('match')
  const [showSample, setShowSample] = useState(false)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)

  const tabs = [
    { key: 'match' as const, label: 'Match Scripts', icon: <FiPlay className="w-4 h-4" /> },
    { key: 'african' as const, label: 'African Spotlight', icon: <FiGlobe className="w-4 h-4" /> },
    { key: 'trending' as const, label: 'Trending Content', icon: <FiTrendingUp className="w-4 h-4" /> },
  ]

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground" style={{ background: 'linear-gradient(135deg, hsl(260 35% 8%) 0%, hsl(280 30% 10%) 50%, hsl(240 25% 8%) 100%)' }}>
        {/* Header */}
        <header className="border-b border-border/30 backdrop-blur-[12px]">
          <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <FiZap className="w-8 h-8 text-primary" />
                <div className="absolute inset-0 w-8 h-8 text-primary blur-md opacity-60"><FiZap className="w-8 h-8" /></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight" style={{ textShadow: '0 0 20px rgba(0,255,255,0.5), 0 0 40px rgba(0,255,255,0.2)' }}>
                  FootballPulse AI
                </h1>
                <p className="text-xs text-muted-foreground tracking-wider uppercase">Automated Football Content Creator</p>
              </div>
            </div>
            {/* Sample Data Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <span className="text-xs text-muted-foreground">Sample Data</span>
              <div className="relative">
                <input type="checkbox" checked={showSample} onChange={(e) => setShowSample(e.target.checked)} className="sr-only peer" />
                <div className="w-9 h-5 bg-muted rounded-full peer-checked:bg-primary transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-foreground rounded-full transition-transform peer-checked:translate-x-4 peer-checked:bg-primary-foreground" />
              </div>
            </label>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className="border-b border-border/20 backdrop-blur-[12px]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all duration-300 ${activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'}`} style={activeTab === tab.key ? { textShadow: '0 0 10px rgba(0,255,255,0.4)' } : undefined}>
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="max-w-6xl mx-auto px-4 py-6">
          {activeTab === 'match' && (
            <MatchScriptsTab showSample={showSample} activeAgentId={activeAgentId} setActiveAgentId={setActiveAgentId} />
          )}
          {activeTab === 'african' && (
            <AfricanSpotlightTab showSample={showSample} activeAgentId={activeAgentId} setActiveAgentId={setActiveAgentId} />
          )}
          {activeTab === 'trending' && (
            <TrendingContentTab showSample={showSample} activeAgentId={activeAgentId} setActiveAgentId={setActiveAgentId} />
          )}
        </main>

        {/* Agent Status Footer */}
        <footer className="border-t border-border/20 backdrop-blur-[12px] mt-auto">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="bg-card/60 backdrop-blur-[12px] border border-white/10 rounded p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-medium">AI Agents</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {AGENTS.map((agent) => (
                  <div key={agent.id} className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${activeAgentId === agent.id ? 'bg-primary animate-pulse shadow-[0_0_6px_rgba(0,255,255,0.6)]' : 'bg-muted-foreground/40'}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{agent.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{agent.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  )
}
