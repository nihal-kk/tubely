const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("send")
    .setDescription("Send announcement to all servers"),

  async execute(interaction) {

    // 🔐 Owner only
    if (interaction.user.id !== "1427176678760644750") {
      return interaction.reply({
        content: "❌ Only bot owner can use this command!",
        ephemeral: true
      });
    }

    const dcChannels = process.env.CHANNEL_IDS.split(",");

    const embed = new EmbedBuilder()
      .setColor("#FF0000")
      .setTitle("📢 Attention YouTubers!")
      .setDescription(`Dear @everyone 🙂‍↕️,

I am now an **automatic video notification bot** 🤖  
If you are a creator from **Pathalam Network** or **Devasuram SMP**, you can get your videos featured here!

🎬 Just send your **YouTube channel link** to the owner:  
👉 <@1427176678760644750>

🚀 Get your videos promoted instantly!`)
      .setFooter({ text: "Pathalam Network" })
      .setTimestamp();

    let success = 0;
    let failed = 0;

    for (const id of dcChannels) {
      try {
        const channel = await interaction.client.channels.fetch(id);
        if (!channel) continue;

        await channel.send({
          content: "@everyone", // 🔥 ping here
          embeds: [embed]
        });

        success++;

      } catch (err) {
        failed++;
        console.log(`❌ Failed to send to ${id}`);
      }
    }

    await interaction.reply({
      content: `✅ Sent to ${success} channels\n❌ Failed: ${failed}`,
      ephemeral: true
    });
  }
};