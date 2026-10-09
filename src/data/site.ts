export type Lang = 'en' | 'zh';
export type Text = string | { en: string; zh: string };

export const tr = (v: Text | undefined, lang: Lang) => (v == null ? '' : typeof v === 'string' ? v : v[lang]);

export const profile = {
  name: 'Joya Chen',
  nameZh: '陈卓',
  role: {
    en: ['Research Scientist @ ByteDance Seed', 'Ph.D. @ National University of Singapore'],
    zh: ['字节跳动 Seed 研究科学家', '新加坡国立大学 博士'],
  },
  now: {
    title: 'visual coding agents',
  },
  before: {
    en: ['streaming VLMs', 'test-time training'],
    zh: ['流式 VLM', '测试时训练'],
  },
  links: [
    { id: 'scholar', label: { en: 'Scholar', zh: '谷歌学术' }, url: 'https://scholar.google.com/citations?user=IIx9dc8AAAAJ' },
    { id: 'github', label: 'GitHub', url: 'https://github.com/chenjoya' },
    { id: 'zhihu', label: { en: 'Zhihu', zh: '知乎' }, url: 'https://www.zhihu.com/people/chenjoya' },
  ],
} as const;

export interface Publication {
  id: string;
  title: string;
  url: string;
  authors: string;
  venue: string;
  venueFull?: string;
  award?: string;
  year: number;
  img: string;
  links: { label: string; url: string }[];
  repo?: string;
  note?: Text;
  lead?: boolean;
  seed?: boolean;
}

const contributed: Text = { en: 'Contributed to the streaming capability.', zh: '参与其中流式能力的研发。' };

export const publications: Publication[] = [
  {
    id: 'e2ttt',
    title: 'Rethinking Expressivity and Efficiency in Test-Time Training',
    url: 'https://arxiv.org/abs/2608.21308',
    authors: 'Zeyun Zhong, Joya Chen, Manuel Martin, Frederik Diederichs, Juergen Gall, Juergen Beyerer',
    venue: 'arXiv',
    year: 2026,
    img: 'e2ttt.png',
    links: [
      { label: 'Paper', url: 'https://arxiv.org/abs/2608.21308' },
      { label: 'Code', url: 'https://github.com/zeyun-zhong/E2-TTT' },
    ],
    repo: 'zeyun-zhong/E2-TTT',
  },
  {
    id: 'streamttt',
    title: 'StreamTTT: Reconciling Real-Time Perception and Long-Term Memory in Streaming VLMs',
    url: 'https://arxiv.org/abs/2608.13416',
    authors: 'Joya Chen, Zeyun Zhong, Mike Zheng Shou',
    venue: 'arXiv',
    year: 2026,
    img: 'streamttt.jpg',
    links: [
      { label: 'Paper', url: 'https://arxiv.org/abs/2608.13416' },
      { label: 'Code', url: 'https://github.com/zeyun-zhong/StreamTTT' },
    ],
    repo: 'zeyun-zhong/StreamTTT',
    lead: true,
  },
  {
    id: 'seedrealtime',
    title: 'SeedRealtime: An Audio-Visual Full-Duplex LLM',
    url: 'https://seed.bytedance.com/en/SeedRealtime',
    authors: 'ByteDance Seed',
    note: { en: 'A native audio-visual full-duplex LLM.', zh: '原生的音视频全双工大模型。' },
    venue: 'Tech Blog',
    year: 2026,
    img: 'seedrealtime.jpg',
    links: [{ label: 'Homepage', url: 'https://seed.bytedance.com/en/SeedRealtime' }],
    seed: true,
  },
  {
    id: 'seed2.1',
    title: 'Seed2.1 Model Card',
    url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/seed2.1/Seed2_1_Model_Card.pdf',
    authors: 'ByteDance Seed',
    note: contributed,
    venue: 'Model Card',
    year: 2026,
    img: 'seed2.1.jpg',
    links: [
      { label: 'Homepage', url: 'https://seed.bytedance.com/en/seed2_1' },
      { label: 'Model Card', url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/seed2.1/Seed2_1_Model_Card.pdf' },
    ],
    seed: true,
  },
  {
    id: 'seed2.0',
    title: 'Seed2.0 Model Card',
    url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/seed2/0214/Seed2.0%20Model%20Card.pdf',
    authors: 'ByteDance Seed',
    note: contributed,
    venue: 'Model Card',
    year: 2026,
    img: 'seed2.png',
    links: [
      { label: 'Homepage', url: 'https://seed.bytedance.com/en/seed2' },
      { label: 'Model Card', url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/seed2/0214/Seed2.0%20Model%20Card.pdf' },
    ],
    seed: true,
  },
  {
    id: 'seed1.8',
    title: 'Seed1.8 Model Card',
    url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/research/Seed-1.8-Modelcard.pdf',
    authors: 'ByteDance Seed',
    note: contributed,
    venue: 'Model Card',
    year: 2025,
    img: 'seed1.8.jpg',
    links: [
      { label: 'Homepage', url: 'https://seed.bytedance.com/en/seed1_8' },
      { label: 'Model Card', url: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/research/Seed-1.8-Modelcard.pdf' },
    ],
    seed: true,
  },
  {
    id: 'seed1.5vl',
    title: 'Seed1.5-VL Technical Report',
    url: 'https://huggingface.co/papers/2505.07062',
    authors: 'ByteDance Seed',
    note: { en: 'Contributed to the streaming capability and the interactive demo.', zh: '参与其中流式能力与交互式 Demo 的研发。' },
    venue: 'arXiv',
    year: 2025,
    img: 'seed1.5vl.png',
    links: [
      { label: 'Homepage', url: 'https://seed.bytedance.com/zh/tech/seed1_5_vl' },
      { label: 'HuggingFace Demo', url: 'https://huggingface.co/spaces/ByteDance-Seed/Seed1.5-VL' },
      { label: 'GitHub', url: 'https://github.com/ByteDance-Seed/Seed1.5-VL' },
      { label: 'API', url: 'https://www.volcengine.com/experience/ark?model=doubao-1-5-thinking-vision-pro-250428' },
    ],
    repo: 'ByteDance-Seed/Seed1.5-VL',
    seed: true,
  },
  {
    id: 'livecc',
    title: 'LiveCC: Learning Video LLM with Streaming Speech Transcription at Scale',
    url: 'https://showlab.github.io/livecc/',
    authors: 'Joya Chen*, Ziyun Zeng*, Yiqi Lin*, Wei Li, Zejun Ma, Mike Zheng Shou',
    venue: 'CVPR',
    year: 2025,
    img: 'livecc.png',
    note: { en: 'Fully open-sourced: checkpoints, pre-training & SFT data, training code, benchmark and demo.', zh: '全部开源：模型、预训练与 SFT 数据、训练代码、评测基准和 Demo。' },
    links: [{ label: 'Project', url: 'https://showlab.github.io/livecc/' }],
    repo: 'showlab/livecc',
    lead: true,
  },
  {
    id: 'videollm-mod',
    title: 'VideoLLM-MoD: Efficient Video-Language Streaming with Mixture-of-Depths Vision Computation',
    url: 'https://arxiv.org/abs/2408.16730',
    authors: 'Shiwei Wu*, Joya Chen*, Kevin Qinghong Lin, Qimeng Wang, Yan Gao, Qianli Xu, Tong Xu, Yao Hu, Enhong Chen, Mike Zheng Shou',
    venue: 'NeurIPS',
    year: 2024,
    img: 'videollm-mod.png',
    links: [{ label: 'Paper', url: 'https://arxiv.org/abs/2408.16730' }],
    lead: true,
  },
  {
    id: 'videolisa',
    title: 'One Token to Seg Them All: Language Instructed Reasoning Segmentation in Videos',
    url: 'https://arxiv.org/abs/2409.19603',
    authors: 'Zechen Bai, Tong He, Haiyang Mei, Pichao Wang, Ziteng Gao, Joya Chen, Lei Liu, Zheng Zhang, Mike Zheng Shou',
    venue: 'NeurIPS',
    year: 2024,
    img: 'videolisa.jpg',
    links: [
      { label: 'Paper', url: 'https://arxiv.org/abs/2409.19603' },
      { label: 'Code', url: 'https://github.com/showlab/VideoLISA' },
    ],
    repo: 'showlab/VideoLISA',
  },
  {
    id: 'movieseq',
    title: 'Learning Video Context as Interleaved Multimodal Sequences',
    url: 'https://arxiv.org/abs/2407.21757',
    authors: 'Kevin Qinghong Lin, Pengchuan Zhang, Difei Gao, Xide Xia, Joya Chen, Ziteng Gao, Jinheng Xie, Xuhong Xiao, Mike Zheng Shou',
    venue: 'ECCV',
    year: 2024,
    img: 'movieseq.png',
    links: [
      { label: 'Paper', url: 'https://arxiv.org/abs/2407.21757' },
      { label: 'Code', url: 'https://github.com/showlab/MovieSeq' },
    ],
    repo: 'showlab/MovieSeq',
  },
  {
    id: 'videollm-online',
    title: 'VideoLLM-online: Online Video Large Language Model for Streaming Video',
    url: 'https://showlab.github.io/videollm-online/',
    authors: 'Joya Chen, Zhaoyang Lv, Shiwei Wu, Kevin Qinghong Lin, Chenan Song, Difei Gao, Jia-Wei Liu, Ziteng Gao, Dongxing Mao, Mike Zheng Shou',
    venue: 'CVPR',
    year: 2024,
    img: 'videollm-online.png',
    note: { en: 'Paper, code, data, demo and checkpoints on the project page.', zh: '项目主页提供论文、代码、数据、Demo 与模型。' },
    links: [{ label: 'Project', url: 'https://showlab.github.io/videollm-online/' }],
    repo: 'showlab/videollm-online',
    lead: true,
  },
  {
    id: 'egoexo4d',
    title: 'Ego-Exo4D: Understanding Skilled Human Activity from First- and Third-Person Perspectives',
    url: 'https://ego-exo4d-data.org/',
    authors: 'Kristen Grauman, Andrew Westbury, Lorenzo Torresani, Kris Kitani, Jitendra Malik, Triantafyllos Afouras, Kumar Ashutosh, Vijay Baiyya, Siddhant Bansal, Bikram Boote, Eugene Byrne, Zach Chavis, Joya Chen, …, Mike Zheng Shou, Michael Wray',
    venue: 'CVPR',
    award: 'Oral',
    year: 2024,
    img: 'egoexo4d.png',
    links: [{ label: 'Project', url: 'https://ego-exo4d-data.org/' }],
  },
  {
    id: 'assistgpt',
    title: 'AssistGPT: A General Multi-modal Assistant that can Plan, Execute, Inspect, and Learn',
    url: 'https://arxiv.org/abs/2306.08640',
    authors: 'Difei Gao, Lei Ji, Luowei Zhou, Kevin Qinghong Lin, Joya Chen, Zihan Fan, Mike Zheng Shou',
    venue: 'arXiv',
    year: 2023,
    img: 'assistgpt.png',
    links: [
      { label: 'Paper', url: 'https://arxiv.org/pdf/2306.08640.pdf' },
      { label: 'Page', url: 'https://showlab.github.io/assistgpt/' },
    ],
  },
  {
    id: 'univtg',
    title: 'UniVTG: Towards Unified Video-Language Temporal Grounding',
    url: 'https://arxiv.org/abs/2307.16715',
    authors: 'Kevin Qinghong Lin, Pengchuan Zhang, Joya Chen, Shraman Pramanick, Difei Gao, Alex Jinpeng Wang, Rui Yan, Mike Zheng Shou',
    venue: 'ICCV',
    year: 2023,
    img: 'univtg.jpg',
    links: [
      { label: 'Paper', url: 'https://arxiv.org/pdf/2307.16715.pdf' },
      { label: 'Code', url: 'https://github.com/showlab/UniVTG' },
      { label: 'Demo', url: 'https://huggingface.co/spaces/KevinQHLin/UniVTG' },
    ],
    repo: 'showlab/UniVTG',
  },
  {
    id: 'afformer',
    title: 'Affordance Grounding from Demonstration Video to Target Image',
    url: 'https://arxiv.org/abs/2303.14644',
    authors: 'Joya Chen, Difei Gao, Kevin Qinghong Lin, Mike Zheng Shou',
    venue: 'CVPR',
    year: 2023,
    img: 'afformer.png',
    links: [
      { label: 'Paper', url: 'https://arxiv.org/pdf/2303.14644.pdf' },
      { label: 'Code', url: 'https://github.com/showlab/afformer' },
    ],
    repo: 'showlab/afformer',
    lead: true,
  },
  {
    id: 'dropit',
    title: 'DropIT: Dropping Intermediate Tensors for Memory-Efficient DNN Training',
    url: 'https://arxiv.org/abs/2202.13808',
    authors: 'Joya Chen*, Kai Xu*, Yuhui Wang, Yifei Cheng, Angela Yao',
    venue: 'ICLR',
    year: 2023,
    img: 'dropit.png',
    links: [
      { label: 'OpenReview', url: 'https://openreview.net/forum?id=Kn6i2BZW69w' },
      { label: 'arXiv', url: 'https://arxiv.org/abs/2202.13808' },
      { label: 'Code', url: 'https://github.com/chenjoya/dropit' },
    ],
    repo: 'chenjoya/dropit',
    lead: true,
  },
  {
    id: 'assistq',
    title: 'AssistQ: Affordance-centric Question-driven Task Completion for Egocentric Assistant',
    url: 'https://arxiv.org/abs/2203.04203',
    authors: 'Benita Wong*, Joya Chen*, You Wu*, Stan Weixian Lei, Dongxing Mao, Difei Gao, Mike Zheng Shou',
    venue: 'ECCV',
    year: 2022,
    img: 'assistq.png',
    links: [
      { label: 'Paper', url: 'https://arxiv.org/abs/2203.04203' },
      { label: 'Page', url: 'https://showlab.github.io/assistq' },
      { label: 'Code', url: 'https://github.com/chenjoya/q2a' },
      { label: "Challenge@CVPR'22", url: 'https://sites.google.com/view/loveucvpr22' },
    ],
    lead: true,
  },
  {
    id: 'sampling-free',
    title: 'Is Heuristic Sampling Necessary in Training Deep Object Detectors?',
    url: 'https://ieeexplore.ieee.org/document/9526287',
    authors: 'Joya Chen, Dong Liu, Tong Xu, Shiwei Wu, Yifei Chen, Enhong Chen',
    venue: 'TIP',
    venueFull: 'IEEE Transactions on Image Processing',
    year: 2021,
    img: 'sampling_free.png',
    links: [
      { label: 'Paper', url: 'https://ieeexplore.ieee.org/document/9526287' },
      { label: 'Code', url: 'https://github.com/ChenJoya/sampling-free' },
    ],
    repo: 'chenjoya/sampling-free',
    lead: true,
  },
  {
    id: 'sogg',
    title: 'Linking the Characters: Video-oriented Social Graph Generation via Hierarchical-cumulative GCN',
    url: 'https://dl.acm.org/doi/10.1145/3474085.3475684',
    authors: 'Shiwei Wu, Joya Chen, Tong Xu, Liyi Chen, Lingfei Wu, Yao Hu, Enhong Chen',
    venue: 'ACM MM',
    award: 'Oral',
    year: 2021,
    img: 'sogg.png',
    links: [{ label: 'Paper', url: 'https://dl.acm.org/doi/10.1145/3474085.3475684' }],
  },
];

/** Shown by default; the Seed reports collapse into a single row there. */
export const selected = ['streamttt', 'seed-models', 'livecc', 'videollm-online', 'afformer', 'dropit'];

export const seedModels = {
  title: { en: 'ByteDance Seed models', zh: '字节跳动 Seed 系列模型' } as Text,
  members: 'Seed1.5-VL · Seed1.8 · Seed2.0 · Seed2.1 · SeedRealtime',
  note: { en: 'Contributed to the streaming capability across releases.', zh: '参与历代模型中流式能力的研发。' } as Text,
  years: '2025–26',
  img: 'seed2.1.jpg',
};

export const experience: { years: string; org: Text; role: Text; with?: { name: string; url: string } }[] = [
  { years: '2025 –', org: { en: 'ByteDance Seed', zh: '字节跳动 Seed' }, role: { en: 'Research Intern → Research Scientist', zh: '研究实习生 → 研究科学家' } },
  { years: '2024 – 25', org: 'TikTok AIIC', role: { en: 'Research Intern', zh: '研究实习生' }, with: { name: 'Wei Li', url: 'https://scholar.google.com/citations?user=q8ZrKVIAAAAJ' } },
  { years: '2023 – 24', org: 'Meta FAIR', role: { en: 'Research Intern', zh: '研究实习生' }, with: { name: 'Huiyu Wang', url: 'https://csrhddlam.github.io/' } },
  { years: '2023', org: 'Meta Reality Labs Research', role: { en: 'Research Intern', zh: '研究实习生' }, with: { name: 'Zhaoyang Lv', url: 'https://lvzhaoyang.github.io/' } },
];

export const education: { degree: Text; school: Text; url: string; with?: Text }[] = [
  { degree: { en: 'Ph.D.', zh: '博士' }, school: { en: 'NUS, Show Lab', zh: '新加坡国立大学 Show Lab' }, url: 'https://sites.google.com/view/showlab', with: 'Mike Shou' },
  { degree: { en: 'M.S.', zh: '硕士' }, school: { en: 'USTC, Computer Science', zh: '中国科学技术大学 计算机学院' }, url: 'https://en.cs.ustc.edu.cn/', with: { en: 'Enhong Chen, Tong Xu & Dong Liu', zh: '陈恩红、徐童、刘东' } },
  { degree: { en: 'R.A.', zh: '研究助理' }, school: { en: 'NUS, CVML Group', zh: '新加坡国立大学 CVML 组' }, url: 'https://sites.google.com/comp.nus.edu.sg/cvml', with: 'Angela Yao' },
  { degree: { en: 'B.E.', zh: '本科' }, school: { en: 'WUT, Automotive Engineering', zh: '武汉理工大学 汽车工程学院' }, url: 'http://auto.whut.edu.cn/' },
];

export const talks: {
  date?: string;
  role: Text;
  title: string;
  venue: Text;
  url?: string;
  extra?: { label: Text; url: string };
}[] = [
  {
    date: '2026-06',
    role: { en: 'Student organizer', zh: '学生组织者' },
    title: 'Bridging Vision, Language, and Action',
    venue: 'CVPR 2026',
    url: 'https://activis-workshop.github.io/',
  },
  {
    date: '2025-08',
    role: { en: 'Invited talk', zh: '受邀报告' },
    title: 'Learning Omni Video Stream',
    venue: { en: 'ByteDance Seed (Seedance)', zh: '字节跳动 Seed（Seedance）' },
  },
  {
    date: '2025-06',
    role: { en: 'Core organizer', zh: '核心组织者' },
    title: 'Multimodal Video Agent Workshop',
    venue: 'CVPR 2025',
    url: 'https://sites.google.com/view/loveucvpr25/home',
    extra: { label: { en: 'Videos', zh: '录像' }, url: 'https://www.youtube.com/playlist?list=PLDbVr1Ra2aamVoqXnMohpFxa_gfZswE-h' },
  },
  {
    date: '2024-06',
    role: { en: 'Invited talk', zh: '受邀报告' },
    title: 'VideoLLM-online',
    venue: { en: 'Alibaba Qwen', zh: '阿里通义千问' },
    extra: { label: { en: 'Slides', zh: '幻灯片' }, url: '/data/talk_onlinevlm_qwen.pdf' },
  },
  {
    date: '2024-06',
    role: { en: 'Core organizer', zh: '核心组织者' },
    title: 'LOVEU Workshop',
    venue: 'CVPR 2024',
    url: 'https://sites.google.com/view/loveucvpr24/home',
  },
];

export const honors: { date?: string; title: Text; url?: string }[] = [
  { date: '2020-12', title: { en: '1st place, HO-3D leaderboard', zh: 'HO-3D 排行榜第一名' }, url: 'https://competitions.codalab.org/competitions/22485#results' },
  { date: '2018-09', title: { en: '1st place, PASCAL VOC detection (comp. 3)', zh: 'PASCAL VOC 目标检测（comp. 3）第一名' }, url: 'http://host.robots.ox.ac.uk:8080/leaderboard/displaylb_main.php?challengeid=11&compid=3' },
  { date: '2018-03', title: { en: '1st place, National Postgraduate Entrance Exam (USTC CS)', zh: '全国硕士研究生入学考试，中国科大计算机学院第一名' } },
];
