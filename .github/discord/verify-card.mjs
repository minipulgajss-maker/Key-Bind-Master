import { IS_COMPONENTS_V2, SITE } from './api.mjs';

export const verifyCard = {
  flags: IS_COMPONENTS_V2,
  allowed_mentions: { parse: [] },
  components: [{
    type: 17,
    components: [
      { type: 9, components: [{ type: 10, content: '-# KeyBind Master · Community\n## Welcome aboard\nThe home of KeyBind Master: free daily codes, updates first, help from the staff and people who love shortcuts.' }], accessory: { type: 11, media: { url: `${SITE}/img/icon.png` } } },
      { type: 14, divider: true, spacing: 1 },
      { type: 10, content: '**Be respectful**\n-# No insults, hate or harassment\n**No spam or ads**\n-# No invite links, self promotion or flooding\n**Stay safe**\n-# No scams, fake links or "free nitro". The staff never DMs you first asking for codes or passwords\n**Use the right place**\n-# Questions and problems go to a ticket in #tickets' },
      { type: 14, divider: true, spacing: 2 },
      { type: 1, components: [{ type: 2, style: 1, label: 'Verify and enter', custom_id: 'kbm:verify' }, { type: 2, style: 5, label: 'Website', url: SITE }] },
      { type: 10, content: '-# By verifying you agree to the rules, the Discord Terms of Service and Community Guidelines.' }
    ]
  }]
};
