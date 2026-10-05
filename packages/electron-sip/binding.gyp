{
  # Build config for the native electron-sip N-API addon (C++ wrapper around pjproject/pjsua2).
  # Each OS branch resolves pjproject differently:
  #   - mac:   brew install pjproject (libs come from `brew --prefix pjproject`)
  #   - linux: system pjproject (resolved via pkg-config libpjproject)
  #   - win:   pjproject built from source, exposed via env PJSIP_PREFIX

  "variables": {
    "pjsip_prefix%": "<!(node -e \"process.stdout.write(process.env.PJSIP_PREFIX || '')\")"
  },

  "targets": [
    {
      "target_name": "electron-sip",

      "sources": [
        "main.cpp",
        "sip_client.cpp",
        "sip_call.cpp",
        "sip_account.cpp"
      ],

      "include_dirs": [
        "<!@(node -p \"require('napi-thread-safe-callback').include\")",
        "<!@(node -p \"require('node-addon-api').include\")"
      ],

      "defines": [
        # N-API
        "NAPI_VERSION=3",
        "NAPI_CPP_EXCEPTIONS",
        # C++ exceptions (pjsua2 throws)
        "_HAS_EXCEPTIONS=1",
        # Windows/Unicode boilerplate kept for cross-platform parity
        "STATIC",
        "_UNICODE",
        "UNICODE",
        "_CRT_SECURE_NO_DEPRECATE",
        # SIP User-Agent string sent on REGISTER
        "USER_AGENT_NAME=\"Webitel softphone v.dev.win\""
      ],

      # POSIX-style compiler flags
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],

      # Xcode (clang on macOS): allow C++ exceptions, target macOS 11+
      "xcode_settings": {
        "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
        "CLANG_CXX_LIBRARY": "libc++",
        "MACOSX_DEPLOYMENT_TARGET": "11.0"
      },

      # MSVC (Windows): /EHsc + /MT (static CRT, matches Release-Static pjproject build)
      "msvs_settings": {
        "VCCLCompilerTool": {
          "ExceptionHandling": 1,
          "RuntimeLibrary": 0
        }
      },

      "conditions": [
        # --- macOS ----------------------------------------------------------
        [ "OS==\"mac\"", {
          "variables": {
            "brew_pj%": "<!(brew --prefix pjproject)",
            "brew_ssl%": "<!(brew --prefix openssl@3)"
          },
          "defines": [
            "PJ_AUTOCONF=1",
            "PJ_IS_BIG_ENDIAN=0",
            "PJ_IS_LITTLE_ENDIAN=1"
          ],
          "include_dirs": [
            "<(brew_pj)/include"
          ],
          "libraries": [
            # pjproject libs (glob matches both arm64 and x86_64 brew bottles)
            "<!@(echo <(brew_pj)/lib/libpjsua2-*.a)",
            "<!@(echo <(brew_pj)/lib/libpjsua-*-apple-darwin*.a)",
            "<!@(echo <(brew_pj)/lib/libpjsip-ua-*.a)",
            "<!@(echo <(brew_pj)/lib/libpjsip-simple-*.a)",
            "<!@(echo <(brew_pj)/lib/libpjsip-*-apple-darwin*.a)",
            "<!@(echo <(brew_pj)/lib/libpjmedia-codec-*.a)",
            "<!@(echo <(brew_pj)/lib/libpjmedia-audiodev-*.a)",
            "<!@(echo <(brew_pj)/lib/libpjmedia-videodev-*.a)",
            "<!@(echo <(brew_pj)/lib/libpjmedia-*-apple-darwin*.a)",
            "<!@(echo <(brew_pj)/lib/libpjnath-*.a)",
            "<!@(echo <(brew_pj)/lib/libpjlib-util-*.a)",
            "<!@(echo <(brew_pj)/lib/libpj-*-apple-darwin*.a)",
            # third_party libs shipped with pjproject
            "<!@(echo <(brew_pj)/lib/libsrtp-*.a)",
            "<!@(echo <(brew_pj)/lib/libresample-*.a)",
            "<!@(echo <(brew_pj)/lib/libspeex-*.a)",
            "<!@(echo <(brew_pj)/lib/libgsmcodec-*.a)",
            "<!@(echo <(brew_pj)/lib/libilbccodec-*.a)",
            "<!@(echo <(brew_pj)/lib/libg7221codec-*.a)",
            "<!@(echo <(brew_pj)/lib/libyuv-*.a)",
            "<!@(echo <(brew_pj)/lib/libwebrtc-*.a)",
            # OpenSSL (dynamic link via brew)
            "-L<(brew_ssl)/lib",
            "-lssl",
            "-lcrypto",
            # system
            "-lm",
            "-lpthread",
            # macOS frameworks pjmedia needs (audio + video + crypto)
            "-framework CoreAudio",
            "-framework CoreServices",
            "-framework AudioUnit",
            "-framework AudioToolbox",
            "-framework Foundation",
            "-framework AppKit",
            "-framework AVFoundation",
            "-framework CoreGraphics",
            "-framework QuartzCore",
            "-framework CoreVideo",
            "-framework CoreMedia",
            "-framework Metal",
            "-framework MetalKit",
            "-framework VideoToolbox",
            "-framework Security"
          ]
        } ],

        # --- Linux ----------------------------------------------------------
        [ "OS==\"linux\"", {
          "defines": [
            "PJ_LINUX=1",
            "PJMEDIA_HAS_SRTP=0"
          ],
          "include_dirs": [
            "<!@(pkg-config --cflags-only-I libpjproject | sed 's/-I//g')"
          ],
          "cflags_cc": [
            "<!@(pkg-config --cflags libpjproject)"
          ],
          "libraries": [
            "<!@(pkg-config --libs --static libpjproject)",
            "-lasound",
            "-lstdc++",
            "-lm",
            "-lpthread"
          ]
        } ],

        # --- Windows --------------------------------------------------------
        # Needs pjproject built from source (see CI workflow). PJSIP_PREFIX
        # must contain include/ and lib/ flattened from the build outputs.
        [ "OS==\"win\"", {
          "defines": [
            "_HAS_EXCEPTIONS=1",
            "WIN32",
            "_WIN32",
            "_ITERATOR_DEBUG_LEVEL=0",
            "_HAS_ITERATOR_DEBUGGING=0",
            # Skip optional codecs to avoid drag-in symbols at link time
            "PJMEDIA_HAS_GSM_CODEC=0",
            "PJMEDIA_HAS_SPEEX_CODEC=0",
            "PJMEDIA_HAS_SRTP=0"
          ],
          "include_dirs": [
            "<(pjsip_prefix)/include"
          ],
          "link_settings": {
            "libraries": [
              # pjproject core (order matters: high-level first, low-level last)
              "<(pjsip_prefix)/lib/pjsua2-lib.lib",
              "<(pjsip_prefix)/lib/pjsua-lib.lib",
              "<(pjsip_prefix)/lib/pjsip-ua.lib",
              "<(pjsip_prefix)/lib/pjsip-simple.lib",
              "<(pjsip_prefix)/lib/pjsip-core.lib",
              "<(pjsip_prefix)/lib/pjmedia-codec.lib",
              "<(pjsip_prefix)/lib/pjmedia-audiodev.lib",
              "<(pjsip_prefix)/lib/pjmedia.lib",
              "<(pjsip_prefix)/lib/pjnath.lib",
              "<(pjsip_prefix)/lib/pjlib-util.lib",
              "<(pjsip_prefix)/lib/pjlib.lib",
              # third_party libs the pre-built pjmedia objects reference
              "<(pjsip_prefix)/lib/libresample.lib",
              "<(pjsip_prefix)/lib/libgsmcodec.lib",
              "<(pjsip_prefix)/lib/libilbccodec.lib",
              "<(pjsip_prefix)/lib/libspeex.lib",
              "<(pjsip_prefix)/lib/libsrtp.lib",
              # Windows system libs pjsip uses
              "ws2_32.lib",
              "iphlpapi.lib",
              "dnsapi.lib",
              "winmm.lib",
              "ole32.lib",
              "oleaut32.lib"
            ]
          }
        } ]
      ]
    }
  ]
}
