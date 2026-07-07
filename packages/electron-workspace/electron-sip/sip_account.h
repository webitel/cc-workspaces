//
// Created by igor on 11/10/20.
//

#pragma once

#include <pjsua2.hpp>

namespace SIP {
    class SipEndpoint;
    class SipClient;


    struct callHash {
        std::string sid;
        std::string wid;
    };

    class SipAccount : public pj::Account {
    public:
        std::vector<pj::Call *> calls;
        SipEndpoint *ep; //todo check if delete
        SipClient *client;
    public:
        explicit SipAccount(SipClient *cli);
        ~SipAccount();

        pj::Call* getCallById(const std::string &id);

        void answerById(std::string id);
        void dial(std::string destination);
        void removeCall(pj::Call *call);
        virtual void onRegState(pj::OnRegStateParam &prm);
        virtual void onIncomingCall(pj::OnIncomingCallParam &iprm);
    };
}