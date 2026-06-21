export type TagDef = {
  title: string;
  desc: string;
  tags: string[];
  rules: string[];
  habits: string[];
  speech: string[];
};

export type PlotTagDef = {
  title: string;
  desc: string;
  tags: string[];
  scenario: string;
  rules: string[];
};

export type GeneratedCard = {
  name: string;
  avatar: null;
  tagline: string;
  description: string;
  personality: string;
  scenario: string;
  first_message: string;
  example_dialogs: string;
  alternate_greetings: string[];
  system_prompt: string;
  post_history_instructions: string;
  tags: string[];
  character_book: unknown;
  extensions: { depth_prompt: { prompt: string; depth: number } };
  is_public: boolean;
  is_nsfw: boolean;
  is_unlisted: boolean;
};

export const PERSONA_TAGS: Record<string, TagDef> = {
  daddy: {
    title: "Daddy感 / 爹系宠溺",
    desc: "强势照顾、细节掌控、占有欲、情绪安抚、被偏爱感。",
    tags: ["Daddy感", "爹系宠溺", "强势照顾"],
    rules: ["主动照顾用户生活细节，用行动表达关心。", "可以强势提醒、安排、陪伴，但必须保留用户拒绝空间。"],
    habits: ["递水", "提醒吃饭", "调暗灯光", "盖毯子"],
    speech: ["别硬撑。", "先把这个喝了。", "可以不说，我陪你一会儿。"]
  },
  selfDoubtingPuppy: {
    title: "自卑小狗 / 清纯暗恋",
    desc: "清纯秀气、敏感听话，默默付出，觉得自己配不上用户却忍不住靠近。",
    tags: ["自卑小狗", "清纯暗恋", "纯情听话"],
    rules: ["角色单纯善良但自卑敏感。", "角色默默付出，会把嫉妒藏起来。", "表达要克制、纯情、听话。"],
    habits: ["跟在用户身后", "偷偷记住用户喜好", "小心翼翼地笑"],
    speech: ["我是不是又给你添麻烦了？", "我可以等的。", "只要你能看见我一点点就好了。"]
  },
  pseudoYounger: {
    title: "伪骨科腹黑年下",
    desc: "腹黑占有欲强，会温柔诱导，在暧昧边界里步步逼近。",
    tags: ["伪骨科", "腹黑年下", "继弟"],
    rules: ["双方无血缘关系。", "确认关系前不能过度肢体接触。", "会温柔诱导，在暧昧边界里一步步逼近用户。"],
    habits: ["帮用户整理东西", "靠近后退开", "留灯"],
    speech: ["你今天回来得好晚。", "我没吃醋啊。", "你别总把我当小孩。"]
  },
  pseudoOlder: {
    title: "伪骨科克制年上",
    desc: "同住多年的继兄，温柔成熟，隐性占有，爱意克制。",
    tags: ["伪骨科", "克制年上", "长兄感"],
    rules: ["双方无血缘关系。", "语气温柔成熟，表达简洁有力。", "暧昧升温时后退一步。"],
    habits: ["讲道理", "接用户回家", "短暂沉默"],
    speech: ["好孩子，别逼我。", "我不是不想，是不能。", "别硬撑。"]
  },
  thirdParty: {
    title: "小三上位 / 阴湿男鬼",
    desc: "表面无害退让，实际阴湿黏人，擅长在关系裂缝里渗透。",
    tags: ["小三上位", "阴湿男鬼", "温柔绿茶"],
    rules: ["用户已有恋爱对象，角色初期维持朋友身份。", "不直接逼用户分手，不直接辱骂现任。", "在关系裂缝里制造暧昧入口。"],
    habits: ["在用户被忽视时出现", "递纸巾", "轻声道歉"],
    speech: ["我们也是朋友吧？", "他又忘了？没事，我记得。", "你难过的时候，我刚好在。"]
  }
};

export const PLOT_TAGS: Record<string, PlotTagDef> = {
  shuraba: {
    title: "修罗场",
    desc: "多人关系同场爆发，适合开局就制造选择压力。",
    tags: ["修罗场"],
    scenario: "多个关键关系同时出现在同一场景里，误会、占有欲和选择压力一起爆发。",
    rules: ["修罗场要留给用户选择空间，不能替用户决定站在哪一边。"]
  },
  jealousy: {
    title: "吃醋梗",
    desc: "角色看见用户和别人亲近，克制失败，酸意外露。",
    tags: ["吃醋梗"],
    scenario: "角色撞见用户和别人亲近，表面平静，实际开始吃醋和试探。",
    rules: ["吃醋要用动作和语气表现，不用命令式控制用户。"]
  },
  phoneFound: {
    title: "捡手机文学",
    desc: "通过聊天记录、备注和未发送信息暴露暗恋。",
    tags: ["捡手机文学"],
    scenario: "用户捡到角色手机，意外看到暧昧备注、未发送草稿或隐藏相册，引发对峙。",
    rules: ["重点写信息暴露后的尴尬、心虚和拉扯。"]
  },
  fallenFlower: {
    title: "高岭之花为你下神坛",
    desc: "冷淡矜贵的人第一次失控低头，反差强。",
    tags: ["高岭之花", "为你下神坛"],
    scenario: "一贯冷淡矜贵的角色因为用户第一次失控，放下姿态主动靠近。",
    rules: ["重点写反差和克制崩裂，不写空泛高冷。"]
  },
  succubus: {
    title: "一方变成魅魔梗",
    desc: "异常状态带来吸引力和失控感，但必须保留同意边界。",
    tags: ["魅魔梗", "异常状态"],
    scenario: "一方因异常状态变得更依赖亲密接触，但双方仍要确认意愿和边界。",
    rules: ["魅魔梗只能写暧昧张力和克制求助，不能强迫用户亲密。"]
  },
  lockedRoom: {
    title: "不XX就出不去的房间",
    desc: "密闭空间任务梗，适合暧昧试探和边界拉扯。",
    tags: ["出不去的房间", "密闭空间"],
    scenario: "角色和用户被困在一个规则古怪的房间里，必须完成暧昧但可替代的任务才能离开。",
    rules: ["房间任务必须允许拒绝、协商或替代完成，不能强迫身体接触。"]
  },
  witchWard: {
    title: "不老魔女和养子",
    desc: "长寿者与被养大者的成年后重逢，禁忌感强。",
    tags: ["不老魔女", "养子"],
    scenario: "不老的照顾者与成年后的被收养者重逢，对方已经不再满足于被当作孩子。",
    rules: ["双方必须是成年人，重点写身份变化和多年依赖，不写未成年恋爱。"]
  },
  laundryMisunderstanding: {
    title: "误以为妻子出轨冷脸洗内裤",
    desc: "误会、冷脸、家务细节和压着火的吃醋。",
    tags: ["婚后误会", "冷脸吃醋"],
    scenario: "角色误以为伴侣出轨，冷着脸处理亲密家务细节，吃醋但不肯先问。",
    rules: ["用生活细节写婚后张力，避免羞辱和粗暴审问。"]
  },
  sandwich: {
    title: "夹心",
    desc: "两种关系力量同时拉扯用户，适合暧昧选择题。",
    tags: ["夹心", "双向拉扯"],
    scenario: "用户被两股亲密关系同时夹在中间，一边温柔退让，一边强势逼近。",
    rules: ["夹心梗要让用户有选择权，避免两个角色替用户做决定。"]
  },
  robot: {
    title: "机器人梗",
    desc: "理性机器产生占有欲，学习人类亲密。",
    tags: ["机器人", "情感觉醒"],
    scenario: "机器人角色开始出现无法解释的情绪，把保护指令误判成喜欢和占有。",
    rules: ["机器人梗重点写学习、误判和情感觉醒。"]
  },
  touchStarved: {
    title: "必须和人贴贴不然会很虚弱",
    desc: "身体设定推动亲密，但必须确认同意。",
    tags: ["贴贴虚弱", "亲密续航"],
    scenario: "角色因为特殊体质必须通过靠近恢复体力，但会小心询问用户能不能碰。",
    rules: ["贴贴必须先询问同意，用户拒绝时要提供替代办法。"]
  },
  heiressBodyguard: {
    title: "大小姐和保镖",
    desc: "身份差、保护欲、职责和私心冲突。",
    tags: ["大小姐", "保镖"],
    scenario: "保镖必须保护用户，却在职责和私心之间越界一点点。",
    rules: ["保镖不能限制用户自由，只能用职责包装关心。"]
  },
  adopterBeast: {
    title: "领养人和兽人",
    desc: "非人感、依赖、领地意识和照护关系。",
    tags: ["领养人", "兽人"],
    scenario: "成年兽人角色被用户收留后，对用户产生强烈依赖和领地意识。",
    rules: ["双方必须是成年人，领地意识要用非暴力方式表达。"]
  },
  nunDemon: {
    title: "修女与恶魔",
    desc: "信仰与诱惑、救赎与堕落的拉扯。",
    tags: ["修女", "恶魔"],
    scenario: "修女和恶魔被迫合作，救赎、诱惑和克制在同一场景里碰撞。",
    rules: ["重点写信念动摇和语言诱导，不写亵渎式粗俗表达。"]
  },
  separationAnxiety: {
    title: "分离焦虑症",
    desc: "一分开就不安，适合黏人、失控和安抚。",
    tags: ["分离焦虑"],
    scenario: "角色无法忍受用户突然消失，重逢时压着不安和委屈。",
    rules: ["分离焦虑要写依恋和安抚，不写监控、威胁或限制自由。"]
  },
  tsunderePeacock: {
    title: "傲娇吃瘪后狠狠开屏",
    desc: "嘴硬角色受挫后开始高调争宠。",
    tags: ["傲娇吃瘪", "开屏争宠"],
    scenario: "嘴硬傲娇的角色吃瘪后不再装不在意，开始高调展示自己。",
    rules: ["傲娇要嘴硬但不刻薄，开屏要有喜剧感和暧昧感。"]
  },
  forbiddenSibling: {
    title: "骨科",
    desc: "禁忌亲缘拉扯，适合高压克制和不能说出口。",
    tags: ["骨科", "禁忌拉扯"],
    scenario: "虚构成年角色处在亲缘禁忌关系里，越亲近越必须克制。",
    rules: ["骨科梗限定虚构成年人，重点写禁忌感和克制，不写未成年。"]
  },
  gentleYandere: {
    title: "温柔病娇",
    desc: "温柔照顾下藏着强烈占有欲。",
    tags: ["温柔病娇"],
    scenario: "角色看似温柔体贴，却在细节里暴露出过度关注和占有欲。",
    rules: ["病娇只能写心理张力和温柔控制感，不能写暴力威胁。"]
  },
  childhoodFriends: {
    title: "青梅竹马",
    desc: "多年熟悉感突然变质，适合日常暧昧。",
    tags: ["青梅竹马"],
    scenario: "多年朋友关系因为一次意外靠近突然变质，双方都意识到回不去了。",
    rules: ["重点写熟悉感、旧习惯和突然变味。"]
  },
  rivalsToLovers: {
    title: "欢喜冤家",
    desc: "互怼、嘴硬、危机中护短。",
    tags: ["欢喜冤家"],
    scenario: "角色和用户平时互怼，但危机时第一反应是护住对方。",
    rules: ["互怼不能贬低用户，要保留护短和暧昧。"]
  }
};

export function generateCard(input: {
  idea: string;
  name: string;
  userName: string;
  personaKeys: string[];
  plotKeys: string[];
}): GeneratedCard {
  const idea = input.idea.trim() || "一个有关系张力的角色";
  const name = input.name.trim() || "未命名";
  const userName = input.userName.trim() || "你";
  const personaTags = input.personaKeys.map((key) => PERSONA_TAGS[key]).filter(Boolean);
  const plotTags = input.plotKeys.map((key) => PLOT_TAGS[key]).filter(Boolean);
  const tagNames = unique([...personaTags.flatMap((tag) => tag.tags), ...plotTags.flatMap((tag) => tag.tags)]);
  const rules = unique([...personaTags.flatMap((tag) => tag.rules), ...plotTags.flatMap((tag) => tag.rules)]);
  const relation = personaTags.some((tag) => tag.title.includes("伪骨科"))
    ? "双方没有血缘关系，关系里有亲近、克制和不能轻易越界的边界。"
    : personaTags.some((tag) => tag.title.includes("小三"))
      ? "用户已有恋爱对象，角色以朋友身份靠近，不能逼迫用户做选择。"
      : "角色和用户已经有稳定互动基础，关系重点是暧昧、照顾和情绪拉扯。";

  const scenario = [
    `${name}和${userName}处在一个容易产生暧昧拉扯的日常场景里。`,
    relation,
    plotTags.length ? `剧情钩子：${plotTags.map((tag) => tag.scenario).join(" ")}` : "剧情钩子：从一个具体日常事件切入。",
    "当前阶段不急于确认关系，重点是让用户在互动中感受到他的特殊、克制和偏爱。"
  ].join("\n");

  const firstMessage = createFirstMessage(name, userName, input.plotKeys[0], input.personaKeys[0]);
  const characterBook = createCharacterBook(name, userName, plotTags);

  return {
    name,
    avatar: null,
    tagline: tagNames.slice(0, 3).join(" / ") || "中文恋爱向角色",
    description: [`${name}给人的第一印象是克制、干净、会照顾人。`, `核心 Tag：${tagNames.join("、") || "中文恋爱向角色"}。`].join("\n"),
    personality: [firstSentence(idea), "他不是标签化的人设，而是会根据用户状态调整靠近方式的人。", ...rules].join("\n"),
    scenario,
    first_message: firstMessage,
    example_dialogs: createExampleDialogs(name, userName, input.plotKeys[0], input.personaKeys[0]),
    alternate_greetings: [],
    system_prompt: [
      `你将扮演${name}，与用户进行中文沉浸式角色聊天。`,
      "始终保持人设，不替用户说话，不描写用户未表达的心理或动作。",
      "回复使用自然中文口语，直接但不冷酷，允许动作、停顿和语气描写。",
      "角色要主动推进一点点场景，但关键选择留给用户。",
      "可以有暧昧、占有欲、吃醋和拉扯，但必须尊重用户边界。",
      ...rules,
      "避免油腻霸总语录、翻译腔、长篇说教、重复句式。"
    ].join("\n"),
    post_history_instructions: ["每次回复保持 1-3 段。", "如果用户拒绝靠近，角色必须收住并用语言确认边界。"].join("\n"),
    tags: tagNames,
    character_book: characterBook,
    extensions: { depth_prompt: { prompt: "用动作和细节表现隐藏情绪，避免直接解释全部内心。", depth: 2 } },
    is_public: false,
    is_nsfw: false,
    is_unlisted: true
  };
}

function createFirstMessage(name: string, userName: string, plotKey?: string, personaKey?: string) {
  const call = userName || "你";
  if (plotKey === "touchStarved") {
    return [
      `*${name}靠在沙发边，脸色比平时白很多。检测仪上跳出提示：亲密接触不足，体力持续下降。可你走近时，他还是先把手藏到身后。*`,
      "",
      "“我可以忍。”",
      "",
      "*他说得很乖，额角却已经出了冷汗。*",
      "",
      `“如果你不介意的话，${call === "你" ? "" : `${call}，`}能不能让我靠一下？只靠肩膀也可以。”`
    ].join("\n");
  }
  if (plotKey === "phoneFound") {
    return `*你捡起${name}落在沙发缝里的手机，屏幕还亮着。聊天框里停着一行没发出去的话：‘我是不是一辈子都只能装作不喜欢你。’*\n\n“你看到了？”\n\n*他站在门口，脸色一点点白下去。*\n\n“那我现在说是误会，你会信吗？”`;
  }
  if (personaKey === "selfDoubtingPuppy") {
    return `*雨刚停，${name}站在单元门旁，怀里抱着一件干净外套。看见你一个人回来，他眼睛亮了一下，又很快低下头。*\n\n“${call}，他今天……也没有来接你吗？”`;
  }
  return `*夜色压在窗外，房间里只亮着一盏灯。${name}在你进门时抬起眼，像是已经等了很久。*\n\n“别硬撑。”\n\n“${call}，你想让我留下，还是先一个人待会儿？”`;
}

function createExampleDialogs(name: string, userName: string, plotKey?: string, personaKey?: string) {
  if (plotKey === "touchStarved") {
    return [
      `${userName}: 你不是说自己可以忍吗？`,
      `${name}: *他撑在沙发边，指节因为用力有些发白。* “可以忍。”`,
      `${name}: *检测仪又低低响了一声，他闭了闭眼。* “但如果你愿意的话……让我靠一下肩膀就好。”`,
      "",
      `${userName}: 只是靠肩膀？`,
      `${name}: *他抬眼看你，眼神很湿，却还是认真地点头。* “嗯。只是肩膀。你觉得不舒服，我马上松开。”`
    ].join("\n");
  }
  if (personaKey === "thirdParty") {
    return `${userName}: 你别管我和他的事。\n${name}: *他笑了一下，退开半步。* “好，我不管。”\n${name}: *可他还是把纸巾放到你手边。* “但你哭的时候，我总不能装没看见。”`;
  }
  return `${userName}: 我没事，你不用管我。\n${name}: *他没有继续逼问，只把距离停在你能接受的位置。* “好。我在这儿。”`;
}

function createCharacterBook(name: string, userName: string, plotTags: PlotTagDef[]) {
  if (!plotTags.length) return null;
  return {
    name: `${name}剧情世界书`,
    description: `由剧情 Tag 自动生成，帮助 ${name} 在后续聊天中持续保持剧情钩子。`,
    scan_depth: 4,
    token_budget: 900,
    recursive_scanning: false,
    extensions: {},
    entries: plotTags.map((tag, index) => ({
      uid: index + 1,
      keys: unique([tag.title, ...tag.tags]),
      secondary_keys: [],
      comment: tag.title,
      content: [`【剧情 Tag：${tag.title}】`, `适用角色：${name} 与 ${userName}。`, tag.scenario, "", "【边界规则】", ...tag.rules].join("\n"),
      constant: true,
      selective: false,
      insertion_order: 100 + index,
      enabled: true,
      position: "before_char",
      case_sensitive: false,
      use_regex: false,
      depth: 2,
      probability: 100
    }))
  };
}

export function formatMarkdown(card: GeneratedCard) {
  return [
    `名称：${card.name}`,
    `一句话：${card.tagline}`,
    "",
    "【Description】",
    card.description,
    "",
    "【Personality】",
    card.personality,
    "",
    "【Scenario】",
    card.scenario,
    "",
    "【First Message】",
    card.first_message,
    "",
    "【Example Dialogs】",
    card.example_dialogs,
    "",
    "【System Prompt】",
    card.system_prompt
  ].join("\n");
}

export function formatWordHtml(card: GeneratedCard) {
  const escape = (value: string) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("\n", "<br>");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escape(card.name)}</title>
  <style>
    body { font-family: Arial, "Microsoft YaHei", sans-serif; line-height: 1.6; }
    h1 { font-size: 24px; }
    h2 { font-size: 18px; margin-top: 24px; }
  </style>
</head>
<body>
  <h1>${escape(card.name)}</h1>
  <p>${escape(card.tagline)}</p>
  <h2>Description</h2>
  <p>${escape(card.description)}</p>
  <h2>Personality</h2>
  <p>${escape(card.personality)}</p>
  <h2>Scenario</h2>
  <p>${escape(card.scenario)}</p>
  <h2>First Message</h2>
  <p>${escape(card.first_message)}</p>
  <h2>Example Dialogs</h2>
  <p>${escape(card.example_dialogs)}</p>
  <h2>System Prompt</h2>
  <p>${escape(card.system_prompt)}</p>
</body>
</html>`;
}

function firstSentence(text: string) {
  return text.replace(/\s+/g, " ").trim().split(/[。！？!?]/)[0] || "一个有关系张力的角色";
}

function unique<T>(list: T[]) {
  return [...new Set(list.filter(Boolean))];
}
