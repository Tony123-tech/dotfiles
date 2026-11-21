# ============================================================
# CONTROL PANEL — Customize your shell behavior here
# ============================================================
set -g CYBER_DEFAULT_THEME netrunner # Options: "netrunner" | "matrix" | "synthwave"
set -g CYBER_SHOW_GREETING 1 # 1 = show Netrunner greeting, 0 = silent startup
set -g CYBER_WEATHER_CITY "Hong+Kong" # City for greeting weather
set -g CYBER_FZF_PREVIEW_POS "right:55%" # Preview window position for fzf
set -g CYBER_AUTO_VENV 1 # 1 = auto-activate .venv, 0 = manual

# ============================================================
# Live Theme Switcher (`cybertheme netrunner|matrix|synthwave`)
# ============================================================
function cybertheme --argument-names preset
    switch "$preset"
        case matrix
            set -g _c_pri 00ff9f # Neon Green
            set -g _c_sec 00b8ff # Cyber Blue
            set -g _c_acc fcee09 # Warning Yellow
            set -g _c_bg 090f0a
            set -gx BAT_THEME TwoDark
        case synthwave
            set -g _c_pri ff2a6d # Hot Pink
            set -g _c_sec bd93f9 # Electric Purple
            set -g _c_acc fcee09 # Sunset Yellow
            set -g _c_bg 161826
            set -gx BAT_THEME SynthWave84
        case '*' # Default: netrunner
            set -g _c_pri 05d9e8 # Neon Cyan
            set -g _c_sec ff2a6d # Neon Pink
            set -g _c_acc fcee09 # Cyber Yellow
            set -g _c_bg 161826
            set -gx BAT_THEME SynthWave84
    end

    # Fish Syntax Colors
    set -g fish_color_normal d1f7ff
    set -g fish_color_command $_c_pri --bold
    set -g fish_color_keyword $_c_sec --bold
    set -g fish_color_quote $_c_acc
    set -g fish_color_redirection 00ff9f
    set -g fish_color_end $_c_sec
    set -g fish_color_error $_c_sec --underline
    set -g fish_color_param d1f7ff
    set -g fish_color_comment 6272a4
    set -g fish_color_operator 00ff9f
    set -g fish_color_escape $_c_acc
    set -g fish_color_autosuggestion 585b70
    set -g fish_color_valid_path --underline

    # Fish Pager & Search Colors
    set -g fish_color_search_match --background=711c91 --bold
    set -g fish_color_selection --background=711c91
    set -g fish_pager_color_prefix $_c_pri --bold
    set -g fish_pager_color_completion d1f7ff
    set -g fish_pager_color_description $_c_acc
    set -g fish_pager_color_progress 090a0f --background=$_c_sec

    # FZF Theme & Live Syntax Previews
    set -gx FZF_DEFAULT_OPTS "--color=bg+:#$_c_bg,bg:#090a0f,spinner:#00ff9f,hl:#$_c_sec,fg:#d1f7ff,header:#$_c_sec,info:#$_c_acc,pointer:#$_c_pri,marker:#00ff9f,fg+:#ffffff,prompt:#$_c_pri,hl+:#$_c_sec --border=rounded --prompt='⚡ ' --pointer='▶' --marker='✓'"
    set -gx FZF_CTRL_T_OPTS "--preview 'test -d {} && eza --tree --level=2 --color=always --icons {} || bat --style=numbers --color=always --line-range :300 {}' --preview-window='$CYBER_FZF_PREVIEW_POS:border-rounded' --bind 'ctrl-/:toggle-preview'"
    set -gx FZF_ALT_C_OPTS "--preview 'eza --tree --level=2 --color=always --icons {}' --preview-window='$CYBER_FZF_PREVIEW_POS:border-rounded'"
end

# Apply default theme on startup
cybertheme $CYBER_DEFAULT_THEME

# ============================================================
# Compact Neofetch-Style Netrunner Greeting
# ============================================================
function fish_greeting
    if test "$CYBER_SHOW_GREETING" != 1
        return
    end

    set -l cyan (set_color -o $_c_pri)
    set -l pink (set_color -o $_c_sec)
    set -l yellow (set_color -o $_c_acc)
    set -l green (set_color -o 00ff9f)
    set -l purple (set_color -o bd93f9)
    set -l dim (set_color 6272a4)
    set -l reset (set_color normal)

    # Detect OS (macOS vs Android/Termux vs Linux)
    set -l os_name (uname -s)
    set -l arch (uname -m)
    set -l host_label CyberNode
    set -l os_info ""
    set -l chip ""
    set -l ram_gb ""
    set -l local_ip Offline
    set -l batt N/A

    if test "$os_name" = Darwin
        set host_label TonyMic-MacBook-Air
        set os_info "macOS "(sw_vers -productVersion)" ($arch)"
        set chip (sysctl -n machdep.cpu.brand_string)
        set ram_gb (math (sysctl -n hw.memsize) / 1073741824)"GB Unified"
        set local_ip (ipconfig getifaddr en0 2>/dev/null; or ipconfig getifaddr en1 2>/dev/null; or echo "Offline")
        set batt (pmset -g batt | grep -Eo "\d+%" | head -n1)" Battery"
    else
        # Android / Termux / Linux fallback
        if type -q getprop
            set -l dev_model (getprop ro.product.model 2>/dev/null)
            test -n "$dev_model"; and set host_label (string replace -a ' ' '-' "$dev_model")
            set os_info "Android "(getprop ro.build.version.release)" ($arch)"
            set chip (getprop ro.soc.model 2>/dev/null; or getprop ro.board.platform 2>/dev/null; or echo "ARM SoC")
        else
            set os_info "$os_name ($arch)"
            set chip (awk -F': ' '/model name|Hardware/ {print $2; exit}' /proc/cpuinfo 2>/dev/null)
        end
        set -l mem_kb (awk '/MemTotal/ {print $2}' /proc/meminfo 2>/dev/null)
        if test -n "$mem_kb"
            set ram_gb (math -s1 "$mem_kb / 1048576")"GB RAM"
        end
        if type -q ip
            set local_ip (ip -4 addr show wlan0 2>/dev/null | awk '/inet / {print $2}' | cut -d/ -f1 | head -n1)
        end
        test -z "$local_ip"; and set local_ip "Local Net"
        if type -q termux-battery-status
            set -l pct (termux-battery-status 2>/dev/null | grep -oE '"percentage": *[0-9]+' | grep -oE '[0-9]+')
            test -n "$pct"; and set batt "$pct% Battery"
        end
    end

    set -l disk_free (df -h $HOME | awk 'NR==2 {print $4 " free / " $2}')
    set -l up_time (uptime | awk -F'up |,' '{print $2}' | string trim)

    # Cache weather asynchronously in $TMPDIR
    set -l tmp_dir (set -q TMPDIR; and echo $TMPDIR; or echo "/tmp")
    set -l weather_cache "$tmp_dir/hk_weather_tonymic"
    if not test -f $weather_cache; or test -n (find $weather_cache -mmin +30 2>/dev/null)
        curl -s -G -d "format=3" -A curl --max-time 2 "https://wttr.in" | sed 's/^.*: //' | string trim >$weather_cache 2>/dev/null &
    end
    set -l hk_weather (head -n 1 $weather_cache 2>/dev/null | string trim)
    if test -z "$hk_weather"; or string match -q "*Weather report*" "$hk_weather"
        set hk_weather "HK Net"
    end

    echo ""
    echo "  $pink  ◢████◣  $reset  $yellow TONYMIC$dim@$yellow$host_label$reset  $dim($hk_weather)$reset"
    echo "  $pink ◢◤$cyan ▄▄ $pink◥◣ $reset  $dim ──────────────────────────────────────────$reset"
    echo "  $cyan █ $yellow◢◤◥◣$cyan █ $reset  $pink OS:$reset      $os_info"
    echo "  $cyan █ $yellow◥◣◢◤$cyan █ $reset  $cyan CHIP:$reset    $chip"
    echo "  $pink ◥◣$cyan ▀▀ $pink◢◤ $reset  $green MEMORY:$reset  $ram_gb  $dim|$reset  $purple DISK:$reset $disk_free"
    echo "  $pink  ◥████◤  $reset  $yellow POWER:$reset   $batt  $dim|$reset  $green UP:$reset $up_time"
    echo "  $dim            $reset  $pink NET:$reset     $local_ip  $dim|$reset  $cyan SHELL:$reset fish $FISH_VERSION"
    echo ""
end

# ============================================================
# Environment & PATH
# ============================================================
set -g VIRTUAL_ENV_DISABLE_PROMPT 1

for p in /Users/waika/.opencode/bin /Users/waika/.codeium/windsurf/bin $HOME/.local/bin $HOME/.cargo/bin
    if test -d $p
        fish_add_path $p
    end
end

set -gx EDITOR nvim
set -gx PAGER less
set -gx LESS -R
set -gx EZA_COLORS "di=1;36:ln=1;35:so=1;32:pi=33:ex=1;33:bd=34;46:cd=34;43:su=30;41:sg=30;46:tw=30;42:ow=30;43"

# Neon `man` pages
set -gx LESS_TERMCAP_md (printf "\e[1;36m")
set -gx LESS_TERMCAP_me (printf "\e[0m")
set -gx LESS_TERMCAP_us (printf "\e[1;35m")
set -gx LESS_TERMCAP_ue (printf "\e[0m")
set -gx LESS_TERMCAP_so (printf "\e[1;30;43m")
set -gx LESS_TERMCAP_se (printf "\e[0m")

# ============================================================
# Starship, Zoxide & FZF Initialization
# ============================================================
if type -q starship
    starship init fish | source
end
if type -q zoxide
    zoxide init fish | source
end
if type -q fzf
    fzf --fish | source
end

# ============================================================
# Abbreviations
# ============================================================

# Quick Config Editing
abbr -a cfg 'nvim ~/.config/fish/config.fish && source ~/.config/fish/config.fish'
abbr -a scfg 'nvim ~/.config/starship.toml'

# Files
abbr -a ll 'eza -lah --icons'
abbr -a la 'eza -A --icons'
abbr -a l 'eza -CF --icons'
abbr -a ls 'eza -l --icons --no-permissions'
abbr -a cat 'bat --style=plain'

# Navigation
abbr -a .. 'cd ..'
abbr -a ... 'cd ../..'

# Git
abbr -a g git
abbr -a gs 'git status'
abbr -a gd 'git diff'
abbr -a gl 'git log --oneline --graph --decorate -20'
abbr -a gc 'git commit'
abbr -a gp 'git push'
abbr -a gco 'git checkout'
abbr -a gb 'git branch'

# Tools
abbr -a py python3
abbr -a v nvim
abbr -a cl clear
abbr -a neofetch fastfetch

# Venv
abbr -a venv 'source .venv/bin/activate.fish'
abbr -a venvpy 'python3 -m venv .venv'

# Project Shortcuts
abbr -a cache 'rm -rf ~/.cache/polyglot-native'
abbr -a tst 'time python3 test.py'
abbr -a chain 'ruff check --fix main.py && time python3 main.py'
abbr -a rtpy 'ruff check --fix tokenizer.py && time python3 tokenizer.py'
abbr -a jprint 'javac problemset.java && java problemset'
abbr -a pprint 'python3 problemset.py'

# ============================================================
# Key Bindings
# ============================================================
bind \cf accept-autosuggestion
bind \c\b backward-kill-word
bind \e\[A history-search-backward
bind \e\[B history-search-forward

# ============================================================
# Polyglot-lang Custom Dev Suite
# ============================================================

# Jump directly to the polyglot-lang repository
function poly
    for dir in ~/polyglot-lang ~/Polyglot-lang ~/Desktop/polyglot-lang ~/Documents/polyglot-lang
        if test -d "$dir"
            cd "$dir"
            echo (set_color -o 05d9e8)"⚡ Entered Polyglot-lang root: "(set_color -o fcee09)"$dir"(set_color normal)
            return
        end
    end
    echo (set_color -o ff2a6d)"✖ Could not locate polyglot-lang directory."(set_color normal)
end

# Clear native cache, lint with Ruff, and execute target script (default: test.py)
function prun --argument-names target
    test -z "$target"; and set target "test.py"
    set -l cyan (set_color -o 05d9e8)
    set -l yellow (set_color -o fcee09)
    set -l green (set_color -o 00ff9f)
    set -l pink (set_color -o ff2a6d)
    set -l reset (set_color normal)

    echo "$cyan[1/3]$reset Purging native compile cache (~/.cache/polyglot-native)..."
    rm -rf ~/.cache/polyglot-native

    if type -q ruff; and test -f "$target"
        echo "$cyan[2/3]$reset Running Ruff auto-fix ($target)..."
        ruff check --fix "$target" >/dev/null 2>&1
    end

    if test -f "$target"
        echo "$yellow[3/3]$reset Compiling & running Polyglot target: $green$target$reset"
        echo (set_color 6272a4)"──────────────────────────────────────────"$reset
        time python3 "$target"
    else
        echo "$pink✖ Target file not found: $target$reset"
    end
end

# Benchmark cold compilation vs warm cache execution
function pbench --argument-names target
    test -z "$target"; and set target "test.py"
    if not test -f "$target"
        echo (set_color -o ff2a6d)"✖ Target file not found: $target"(set_color normal)
        return
    end

    set -l cyan (set_color -o 05d9e8)
    set -l yellow (set_color -o fcee09)
    set -l green (set_color -o 00ff9f)
    set -l reset (set_color normal)

    echo "$yellow⚡ Polyglot-lang Benchmark ($target)$reset"

    # Cold run: full transpilation and native binary compilation
    rm -rf ~/.cache/polyglot-native
    echo -n "$cyan  ▶ Cold Compile: $reset"
    /usr/bin/time -p python3 "$target" >/dev/null 2>| awk '/^real/ {print $2 "s"}'

    # Warm run: direct execution from cached native binary
    echo -n "$green  ▶ Warm Cache:   $reset"
    /usr/bin/time -p python3 "$target" >/dev/null 2>| awk '/^real/ {print $2 "s"}'
end

# Watch mode: automatically re-run `prun` on .py or .rs file save (requires `entr`)
function pwatch --argument-names target
    test -z "$target"; and set target "test.py"
    if not type -q entr
        echo (set_color -o fcee09)"💡 Install 'entr' (brew install entr) to enable live file watching."(set_color normal)
        return
    end
    echo (set_color -o 05d9e8)"👁️ Watching for file changes (Ctrl+C to stop)..."(set_color normal)
    find . -maxdepth 3 -name "*.py" -o -name "*.rs" | entr -c fish -c "prun $target"
end

# ============================================================
# General Helper Functions & Auto-Venv
# ============================================================
function __auto_venv --on-variable PWD
    if test "$CYBER_AUTO_VENV" != 1
        return
    end
    if test -d .venv
        if test "$VIRTUAL_ENV" != (realpath .venv)
            source .venv/bin/activate.fish
        end
    else if set -q VIRTUAL_ENV
        deactivate
    end
end

function weather
    curl -s "https://wttr.in"
end

function mkcd
    mkdir -p $argv
    cd $argv
end

function gcm
    git commit -m "$argv"
end

function extract
    if test -f $argv
        switch $argv
            case '*.tar.gz' '*.tgz'
                tar xzf $argv
            case '*.zip'
                unzip $argv
            case '*'
                echo "Unknown archive format: $argv"
        end
    else
        echo "File not found: $argv"
    end
end

# ============================================================
# Initial Startup Checks
# ============================================================
if test "$CYBER_AUTO_VENV" = 1; and test -f .venv/bin/activate.fish
    source .venv/bin/activate.fish
end

# Added by Antigravity CLI installer
set -gx PATH "/Users/waika/.local/bin" $PATH
