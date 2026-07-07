//
// Created by igor on 11/11/20.
//

#include "sip_call.h"


SIP::SipCall::~SipCall() {
    std::cout << "*** Call is being deleted"
              << std::endl;

}

SIP::SipCall::SipCall(pj::Account &acc, std::string wid, bool inc, int call_id) : pj::Call(acc, call_id) {
    myAcc = (SipAccount *) &acc;
    this->wid = std::move(wid);

    if (inc) {
        inviteInfo = getInfo();
        sid = inviteInfo.callIdString;
        std::cout << "*** Incoming Call: " << inviteInfo.remoteUri << " [" << inviteInfo.stateText
                  << " <" << sid << ":" << this->wid << "]" << std::endl;
    }
}

void SIP::SipCall::onCallState(pj::OnCallStateParam &prm) {
//    Call::onCallState(prm);
    pj::CallInfo ci = this->getInfo();
    std::cout << "*** Call: " << ci.remoteUri << " [" << ci.stateText
              << "]" << std::endl;

    if (ci.state == PJSIP_INV_STATE_DISCONNECTED) {
        try {
            if (myAcc)
                myAcc->removeCall(this);
        } catch (pj::Error &err) {
            std::cout << "*** Call: " << err.info(true) << std::endl;
        }
    }
}

void SIP::SipCall::onCallMediaState(pj::OnCallMediaStateParam &prm) {
//    Call::onCallMediaState(prm);
    pj::CallInfo ci = this->getInfo();

    // Iterate all the call medias
    for (unsigned i = 0; i < ci.media.size(); i++) {
        if (ci.media[i].type == PJMEDIA_TYPE_AUDIO && this->getMedia(i)) {
            auto aud_med = (pj::AudioMedia *) this->getMedia(i);

            // Connect the call audio media to sound device
            pj::AudDevManager &mgr = pj::Endpoint::instance().audDevManager();
            aud_med->startTransmit(mgr.getPlaybackDevMedia());
            mgr.getCaptureDevMedia().startTransmit(*aud_med);
        }
    }
}

std::string SIP::SipCall::webitelId() {
    return wid;
}

std::string SIP::SipCall::sipId() {
    return sid;
}

