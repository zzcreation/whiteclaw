import json
import os
import sys
from pathlib import Path

SKILL_ROOT = Path.home() / ".openclaw/workspace/skills/jianying-editor-skill"
SCRIPTS = SKILL_ROOT / "scripts"
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))

from jy_wrapper import JyProject  # noqa: E402

PROJECT_NAME = "OpenClaw_WSL_Vlog_Test_IP展现场"
DRAFT_ROOT_WSL = Path("/mnt/c/Users/pc/AppData/Local/JianyingPro/User Data/Projects/com.lveditor.draft")
ASSET_ROOT_WSL = Path("/mnt/c/Users/pc/OpenClawTemp/jianying-vlog-test/assets")


def wsl_to_windows_path(path: str) -> str:
    p = str(path)
    prefix = "/mnt/c/"
    if p.startswith(prefix):
        return "C:\\" + p[len(prefix):].replace("/", "\\")
    return p


def patch_paths_for_windows(draft_dir: Path) -> int:
    content_path = draft_dir / "draft_content.json"
    data = json.loads(content_path.read_text(encoding="utf-8"))
    changed = 0

    def walk(obj):
        nonlocal changed
        if isinstance(obj, dict):
            for k, v in list(obj.items()):
                if isinstance(v, str) and v.startswith("/mnt/c/"):
                    obj[k] = wsl_to_windows_path(v)
                    changed += 1
                else:
                    walk(v)
        elif isinstance(obj, list):
            for item in obj:
                walk(item)

    walk(data)
    content_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return changed


def main():
    photos = sorted(
        p for p in ASSET_ROOT_WSL.iterdir()
        if p.suffix.lower() in {".jpg", ".jpeg", ".png"}
    )[:8]
    if not photos:
        raise RuntimeError(f"No photos found in {ASSET_ROOT_WSL}")

    project = JyProject(
        PROJECT_NAME,
        width=1080,
        height=1920,
        drafts_root=str(DRAFT_ROOT_WSL),
        overwrite=True,
    )

    # 竖屏照片 vlog：每张 2.4s，首尾加标题/结束语。
    clip_us = 2_400_000
    project.add_text_simple("嗨咚岛 IP 展 · 现场照片", start_time=0, duration=clip_us, track_name="Title")

    for idx, photo in enumerate(photos, start=1):
        start_us = (idx - 1) * clip_us
        seg = project.add_media_safe(str(photo), start_time=start_us, duration=clip_us, track_name="PhotoTrack")
        if seg is None:
            raise RuntimeError(f"Failed to add photo: {photo}")
        if idx in {2, 5, 8}:
            project.add_text_simple(
                ["现场氛围", "展区打卡", "精彩瞬间"][{2: 0, 5: 1, 8: 2}[idx]],
                start_time=start_us + 200_000,
                duration=1_800_000,
                track_name="Captions",
            )

    total_us = len(photos) * clip_us
    project.add_text_simple("WSL 草稿生成测试完成", start_time=max(total_us - 2_200_000, 0), duration=2_000_000, track_name="Ending")

    result = project.save()
    draft_dir = Path(result["draft_path"])
    patched = patch_paths_for_windows(draft_dir)

    print(json.dumps({
        "ok": True,
        "project": PROJECT_NAME,
        "draft_dir_wsl": str(draft_dir),
        "draft_dir_windows": wsl_to_windows_path(str(draft_dir)),
        "photos": len(photos),
        "path_strings_patched_to_windows": patched,
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
