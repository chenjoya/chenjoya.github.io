// The bpy script typed out in the research card. It runs as-is in Blender 5.2 on ~/Desktop/Doubao/Doubao_Dance_Loop.blend,
// whose render is the viewport video (see previews/tools/validate_snippet.py and doubao_shot.py).
export const script = `import bpy

scene = bpy.context.scene
rig = bpy.data.objects["Doubao | rig"]
act = bpy.data.actions["Doubao | dance 5s"]
anim = rig.animation_data_create()
anim.action = act
anim.action_slot = act.slots[0]
scene["suspender_trousers"] = 1

moves = {1: "wave", 37: "hands up",
         59: "shoulder bumps", 98: "turn",
         114: "arms open", 130: "reset"}
markers = scene.timeline_markers
markers.clear()
for f, name in moves.items():
    markers.new(name, frame=f)

scene.frame_end = 150  # 151 == frame 1
bpy.ops.render.render(animation=True)`;

export const lines = script.split('\n');

/** A `frame: "move"` entry of the moves dict. */
export const MOVE = /(\d+): "([^"]+)"/g;

export const moves = [...script.matchAll(MOVE)].map((m) => ({ frame: Number(m[1]), name: m[2] }));
export const actor = script.match(/bpy\.data\.objects\["([^"]+)"\]/)![1];
export const end = Number(script.match(/frame_end = (\d+)/)![1]);

/** Token classes follow Blender's text editor: builtin, string, numeral, comment, symbol. */
export type Kind = '' | 'k' | 's' | 'n' | 'c' | 'p';

const KEYWORDS = new Set(['import', 'from', 'for', 'in', 'def', 'return', 'if', 'else', 'while', 'with', 'as']);
const NUMERALS = new Set(['True', 'False', 'None']);
const TOKEN = /(#.*)|("[^"]*"?)|(\d+(?:\.\d*)?)|([A-Za-z_]\w*)|(\s+)|([^\w\s"#])/y;

export function tokenize(text: string): [Kind, string][] {
  const out: [Kind, string][] = [];
  TOKEN.lastIndex = 0;
  let m: RegExpExecArray | null;
  while (TOKEN.lastIndex < text.length && (m = TOKEN.exec(text))) {
    const kind: Kind = m[1]
      ? 'c'
      : m[2]
        ? 's'
        : m[3]
          ? 'n'
          : m[4]
            ? KEYWORDS.has(m[4])
              ? 'k'
              : NUMERALS.has(m[4])
                ? 'n'
                : ''
            : m[6]
              ? 'p'
              : '';
    const last = out[out.length - 1];
    if (last && last[0] === kind) last[1] += m[0];
    else out.push([kind, m[0]]);
  }
  return out;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const spans = (text: string) => tokenize(text).map(([k, t]) => (k ? `<span class="${k}">${esc(t)}</span>` : esc(t))).join('');

/** Highlighted HTML for one line; `frame: "move"` entries get a hook so playback can mark the active move. */
export function lineHTML(text: string) {
  let html = '';
  let at = 0;
  for (const m of text.matchAll(MOVE)) {
    html += spans(text.slice(at, m.index)) + `<span class="mv" data-f="${m[1]}">${spans(m[0])}</span>`;
    at = m.index! + m[0].length;
  }
  return html + spans(text.slice(at));
}
