//
// Created by igor on 9/11/20.
//

#pragma once

#include "events.h"

#include <iostream>
#include <memory>
#include <vector>

#include "sip_endpoint.h"

namespace SIP {

    static std::string NatRewrite = "rewrite";
    static std::string NatAuto = "auto";

    struct UAConfig {
        std::int32_t register_sec;
        std::string auth;
        std::vector<std::string> codecs;
        std::string extension;
        std::string domain;
        std::string password;
        std::string proxy;
        std::string nat;
    };

    Napi::String VersionWrap(const Napi::CallbackInfo &info);

    UAConfig parseUaParameters(Napi::Env env, Napi::Object params);

    std::string parseDestination(Napi::Env env, Napi::Object params);

    class SipClient final : public Napi::ObjectWrap<SipClient> {
    public:
        explicit SipClient(const Napi::CallbackInfo &);

        ~SipClient();

        Napi::Value TypeWrap(const Napi::CallbackInfo &info);

        Napi::Value VersionWrap(const Napi::CallbackInfo &info);

        Napi::Value CallOptionWrap(const Napi::CallbackInfo &);

        Napi::Value RegisterSipWrap(const Napi::CallbackInfo &info);

        Napi::Value UnRegisterWrap(const Napi::CallbackInfo &info);

        Napi::Value CallWrap(const Napi::CallbackInfo &info);

        Napi::Value SipSessionByCallIdWrap(const Napi::CallbackInfo &info);

        Napi::Value SipSessionBySipIdWrap(const Napi::CallbackInfo &info);

        Napi::Value OnWrap(const Napi::CallbackInfo &info);

        Napi::Value ListMediaSource(const Napi::CallbackInfo &info);

        Napi::Value DestroyWrap(const Napi::CallbackInfo &info);

        static Napi::Function GetClass(Napi::Env);

        void answerById(std::string &id);

        void onRegister();
        void onUnRegister();
        void onNewSession(std::string id, std::string wid);

        std::string sipServer();

    private:
        void unregister();
        void close();
        Napi::Value callObject(Napi::Env env, std::string id, std::string callId);

        std::unique_ptr<SipEndpoint> endpoint;
        std::unique_ptr<SipAccount> account;

        std::string device_id;
        std::string proxy;

        std::shared_ptr<ThreadSafeCallback> onRegisteredCb;
        std::shared_ptr<ThreadSafeCallback> onUnRegisterCb;
        std::shared_ptr<ThreadSafeCallback> onNewSessionCb;
    };
}
